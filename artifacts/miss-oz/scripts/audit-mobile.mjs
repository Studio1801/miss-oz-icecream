/**
 * Read-only mobile geometry audit. Requires Node 22+ and local Chromium.
 * node artifacts/miss-oz/scripts/audit-mobile.mjs [--screenshots] [--out=directory]
 * The supplied console check is unchanged except for returning its table.
 */
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const output = process.argv.find((a) => a.startsWith('--out='))?.slice(6)
  || 'generated-artifacts/mobile-audit';
const screenshots = process.argv.includes('--screenshots');
const origin = process.env.AUDIT_URL || 'http://127.0.0.1:80';
const widths = process.argv.find((a) => a.startsWith('--widths='))?.slice(9).split(',').map(Number)
  || [320, 360, 390, 430];
const routes = process.argv.find((a) => a.startsWith('--routes='))?.slice(9).split(',')
  || ['/', '/menu', '/events', '/wholesale', '/about', '/contact', '/a-missing-page'];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const profile = await mkdtemp(path.join(tmpdir(), 'miss-oz-audit-'));
await mkdir(output, { recursive: true });
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--remote-debugging-port=9531', "--remote-allow-origins=*",
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
let browser;
let sequence = 0;
const pending = new Map();
const results = [];
const watchdog = setTimeout(() => { chrome.kill(); process.exit(2); }, 240_000);

const USER_CHECK = `(() => {
  const E = 34, W = innerWidth, bad = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const p = n.parentElement, t = n.textContent.trim();
    if (!t || p.closest('script,style,[aria-hidden="true"],[data-marquee],[data-hscroll]')) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) {
      if (b.width && (b.left < E - 1 || W - b.right < E - 1)) { bad.push(['edge', t.slice(0, 24), Math.round(b.left), Math.round(W - b.right)]); break; }
    }
    const fs = parseFloat(getComputedStyle(p).fontSize);
    if (fs < 13 && p.getClientRects().length) bad.push(['tiny', t.slice(0, 24), fs]);
  }
  if (document.documentElement.scrollWidth > W) bad.push(['hscroll', document.documentElement.scrollWidth]);
  console.table(bad);
  return bad;
})();`;

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 20_000);
    pending.set(id, (message) => {
      clearTimeout(timer);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    browser.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}

async function settle(scrollPage = false) {
  await evaluate(`(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = 'eager';
    await Promise.race([
      Promise.all([...document.images].map(img => img.decode().catch(() => {}))),
      new Promise(resolve => setTimeout(resolve, 1800))
    ]);
    ${scrollPage ? `for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
      window.scrollTo({top:y, behavior:'instant'});
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    window.scrollTo({top:0, behavior:'instant'});` : ''}
  })()`);
  await wait(scrollPage ? 700 : 450);
}

async function inspect(width, route, state, viewportOnly = false) {
  const bad = await evaluate(USER_CHECK);
  const detail = await evaluate(`(() => {
    const badTexts = new Set(${JSON.stringify(bad)}.map(row => row[1]));
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), details = [];
    let node;
    while ((node = tw.nextNode())) {
      const text = node.textContent.trim(), p = node.parentElement;
      if (!badTexts.has(text.slice(0,24)) || p.closest('script,style,[aria-hidden="true"],[data-marquee],[data-hscroll]')) continue;
      const r = document.createRange(); r.selectNodeContents(node);
      const rects = [...r.getClientRects()];
      if (!rects.length) continue;
      details.push({text:text.slice(0,80),tag:p.tagName,id:p.id,class:p.getAttribute('class'),
        font:getComputedStyle(p).fontSize,
        rects:rects.map(r=>({left:r.left,right:r.right,top:r.top,width:r.width})),
        parents:[p.parentElement,p.parentElement?.parentElement].filter(Boolean).map(e=>({tag:e.tagName,id:e.id,class:e.getAttribute('class')}))});
    }
    return details;
  })()`);
  const key = `${width}-${route === '/' ? 'home' : route.slice(1)}-${state.replaceAll(/[^a-z0-9]+/gi, '-')}`;
  if (screenshots) {
    const height = viewportOnly ? 874 : await evaluate('document.documentElement.scrollHeight');
    const shot = await call('Page.captureScreenshot', {
      format: 'jpeg', quality: 78, captureBeyondViewport: !viewportOnly,
      clip: { x: 0, y: 0, width, height, scale: 1 },
    });
    await writeFile(path.join(output, `${key}.jpg`), Buffer.from(shot.data, 'base64'));
  }
  const item = { width, route, state, bad, detail, screenshot: screenshots ? `${key}.jpg` : undefined };
  results.push(item);
  console.log(`${width} ${route} ${state}: ${bad.length} rows`);
}

try {
  let pages;
  for (let i = 0; i < 100; i++) {
    try {
      pages = await fetch('http://127.0.0.1:9531/json').then((r) => r.json());
      if (pages.some((p) => p.type === 'page')) break;
    } catch { /* Chromium is still opening its debugging port. */ }
    await wait(100);
  }
  browser = new WebSocket(pages.find((p) => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve) => { browser.onopen = resolve; });
  browser.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: "sessionStorage.setItem('miss-oz-intro-seen','1');",
  });
  for (const width of widths) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 874, deviceScaleFactor: 1, mobile: true });
    await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    for (const route of routes) {
      await call('Page.navigate', { url: `${origin}${route}` });
      await wait(650);
      await settle(true);
      await inspect(width, route, 'page');
      if (route === '/menu') {
        const tabs = await evaluate(`[...document.querySelectorAll('[role=tab]')].filter(e => e.getBoundingClientRect().height > 0).map(e=>({id:e.id,text:e.textContent.trim()}))`);
        for (const tab of tabs) {
          await evaluate(`document.getElementById(${JSON.stringify(tab.id)}).click()`);
          await settle(true);
          await inspect(width, route, `tab-${tab.text}`);
        }
      }
      await evaluate("window.scrollTo({top:0,behavior:'instant'}); document.querySelector('.mobile-header-toggle').click()");
      await wait(500);
      await inspect(width, route, 'drawer', true);
      await evaluate("document.querySelector('.mobile-header-toggle').click()");
      await wait(160);
    }
  }
  await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  const failures = results.filter((item) => item.bad.length);
  console.log(JSON.stringify({ states: results.length, failingStates: failures.length, totalRows: failures.reduce((n, r) => n + r.bad.length, 0), output }));
  if (failures.length) process.exitCode = 1;
} finally {
  clearTimeout(watchdog);
  browser?.close();
  chrome.kill();
}
