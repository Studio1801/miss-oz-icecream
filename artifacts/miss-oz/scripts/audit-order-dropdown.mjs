/**
 * Read-only responsive regression check for the Order picker.
 * Requires local Chromium and Node 22+. Does not follow delivery links.
 * node artifacts/miss-oz/scripts/audit-order-dropdown.mjs
 * Optional: AUDIT_URL=https://your-preview.example
 * Evidence is written outside the project, under /tmp.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.AUDIT_URL || 'http://127.0.0.1:80';
const output = await mkdtemp(path.join(tmpdir(), 'miss-oz-order-check-'));
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--remote-debugging-port=9532', '--remote-allow-origins=*',
  `--user-data-dir=${output}/profile`, 'about:blank',
], { stdio: 'ignore' });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let browser;
let sequence = 0;
const pending = new Map();
const results = [];
const watchdog = setTimeout(() => { chrome.kill(); process.exit(2); }, 180_000);

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(method)); }, 15_000);
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

async function click(x, y) {
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, x, y });
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x, y });
}

try {
  let pages;
  for (let i = 0; i < 100; i++) {
    try {
      pages = await fetch('http://127.0.0.1:9532/json').then((r) => r.json());
      if (pages.some((p) => p.type === 'page')) break;
    } catch { /* Chromium is starting. */ }
    await wait(100);
  }
  browser = new WebSocket(pages.find((p) => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve) => { browser.onopen = resolve; });
  browser.onmessage = (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: "sessionStorage.setItem('miss-oz-intro-seen','1');",
  });
  const cases = [
    ...[280, 320, 360, 390, 430, 600, 767, 768, 820, 1024, 1440, 2560]
      .map((width) => ({ width, height: 874, route: '/about' })),
    ...['/', '/events', '/wholesale', '/contact']
      .map((route) => ({ width: 390, height: 844, route })),
    { width: 667, height: 375, route: '/about' },
    { width: 844, height: 390, route: '/about' },
    { width: 320, height: 180, route: '/about' },
  ];
  for (const test of cases) {
    const { width, height, route } = test;
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width < 768 });
    await call('Page.navigate', { url: `${origin}${route}` });
    await wait(900);
    await evaluate('document.fonts.ready');
    const button = await evaluate(`(() => {
      const b = document.querySelector('.mobile-order-pill button');
      const r = b.getBoundingClientRect();
      return { visible: r.width > 0 && r.height > 0, x:r.x+r.width/2, y:r.y+r.height/2 };
    })()`);
    if (!button.visible) {
      if (width < 768) throw new Error(`Missing Order trigger: ${width} ${route}`);
      results.push({ ...test, result: 'desktop navigation; mobile picker correctly hidden' });
      continue;
    }
    await click(button.x, button.y);
    await wait(300);
    const geometry = await evaluate(`(() => {
      const m = document.querySelector('[aria-label="Choose a delivery platform"]');
      if (!m) return { error: 'picker did not open' };
      const r = m.getBoundingClientRect(), v = visualViewport;
      return {
        left:r.left, right:r.right, top:r.top, bottom:r.bottom,
        viewportWidth:v.width, viewportHeight:v.height,
        fits:r.left>=0 && r.right<=v.width+0.5 && r.top>=0 && r.bottom<=v.height+0.5,
        options:[...m.querySelectorAll('a')].map(a=>a.textContent.trim()),
        scrollable:m.scrollHeight>m.clientHeight
      };
    })()`);
    if (!geometry.fits || geometry.options?.length !== 2) throw new Error(JSON.stringify({ ...test, geometry }));
    if (width === 390 && route === '/about') {
      const shot = await call('Page.captureScreenshot', { format: 'png' });
      await writeFile(`${output}/order-mobile-390.png`, Buffer.from(shot.data, 'base64'));
    }
    // Confirm scrolling the picker doesn't dismiss it on short screens.
    await evaluate(`document.querySelector('[aria-label="Choose a delivery platform"]').scrollTop = 999`);
    await wait(100);
    const target = await evaluate(`(() => {
      const m = document.querySelector('[aria-label="Choose a delivery platform"]');
      if (!m) return null;
      const a = m.querySelector('a:last-of-type');
      a.scrollIntoView({block:'nearest'});
      window.__deliveryClicked = false;
      document.addEventListener('click', e => {
        if (e.target.closest('[aria-label="Choose a delivery platform"] a')) {
          e.preventDefault(); window.__deliveryClicked = true;
        }
      }, { capture:true });
      const r = a.getBoundingClientRect();
      return {x:r.x+r.width/2, y:r.y+r.height/2};
    })()`);
    if (!target) throw new Error(`Picker dismissed during its own scroll: ${width}`);
    await click(target.x, target.y);
    await wait(200);
    if (!await evaluate('window.__deliveryClicked')) throw new Error(`Delivery option not clickable: ${width} ${route}`);
    await click(button.x, button.y);
    await wait(250);
    await call('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27 });
    await wait(250);
    if (await evaluate(`!!document.querySelector('[aria-label="Choose a delivery platform"]')`)) {
      throw new Error(`Escape did not dismiss: ${width} ${route}`);
    }
    results.push({ ...test, ...geometry, result: 'fits; delivery link clickable; Escape dismisses' });
    console.log(`PASS ${width}x${height} ${route}`);
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed:results.length, output }));
} finally {
  clearTimeout(watchdog);
  browser?.close();
  chrome.kill();
}
