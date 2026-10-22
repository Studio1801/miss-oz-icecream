/**
 * Read-only Chromium check of every mobile menu category.
 * node artifacts/miss-oz/scripts/audit-menu-alignment.mjs
 * Optional AUDIT_URL override. Screenshots/results are kept in /tmp.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = process.env.AUDIT_URL || 'http://127.0.0.1:80';
const output = await mkdtemp(path.join(tmpdir(), 'miss-oz-menu-alignment-'));
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--remote-debugging-port=9533', '--remote-allow-origins=*',
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

try {
  let pages;
  for (let i = 0; i < 100; i++) {
    try {
      pages = await fetch('http://127.0.0.1:9533/json').then((r) => r.json());
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
  await call('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] });
  const widths = (process.env.AUDIT_WIDTHS || '280,320,360,390,430,600,767').split(',').map(Number);
  const viewports = widths.map(width => ({width,height:874}));
  if (!process.env.AUDIT_WIDTHS) viewports.push({width:667,height:375});
  for (const {width,height} of viewports) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor:1, mobile:true });
    await call('Page.navigate', { url: `${origin}/#menu` });
    await wait(1000);
    await evaluate('document.fonts.ready');
    for (let tab = 0; tab < 5; tab++) {
      await evaluate(`(() => {
        const b=document.getElementById('menu-tab-${tab}');
        b.click();
        if (${tab} === 0) document.getElementById('menu').scrollIntoView({block:'start',behavior:'instant'});
      })()`);
      await wait(450);
      const result = await evaluate(`(() => {
        const nav=document.querySelector('.menu-category-mobile');
        const panel=document.querySelector('#menu section[aria-label="Menu"]');
        const active=panel.querySelector('.menu-panel[aria-hidden="false"]');
        const row=document.querySelector('.menu-tabs-scroll');
        const tab=row.querySelector('[aria-selected="true"]');
        const label=tab.querySelector('span.relative');
        const nr=nav.getBoundingClientRect(), pr=panel.getBoundingClientRect();
        const rr=row.getBoundingClientRect(), lr=label.getBoundingClientRect();
        const errors=[];
        if(Math.abs(nr.left-pr.left)>0.5 || Math.abs(nr.right-pr.right)>0.5) errors.push('frame edges misaligned');
        if(pr.left<20 || pr.right>innerWidth-20) errors.push('panel too close to viewport edge');
        if(lr.left<rr.left+3 || lr.right>rr.right-3) errors.push('selected category label clipped');
        if(active.scrollWidth>active.clientWidth+1) errors.push('content wider than panel');
        const heading=active.querySelector('h3').getBoundingClientRect();
        if(heading.top<nr.bottom-1) errors.push('heading hidden beneath category bar');
        const cropped=[];
        const walker=document.createTreeWalker(active,NodeFilter.SHOW_TEXT);
        let text;
        while((text=walker.nextNode())) {
          if(!text.textContent.trim() || text.parentElement.closest('[aria-hidden="true"],script,style')) continue;
          const range=document.createRange(); range.selectNodeContents(text);
          for(const r of range.getClientRects()) {
            if(r.width && (r.left<pr.left+8 || r.right>pr.right-8)) {
              cropped.push(text.textContent.trim().slice(0,65)); break;
            }
          }
        }
        if(cropped.length) errors.push('text exceeds safe panel inset');
        const cards=[...active.querySelectorAll('.flavor-card')];
        const firstCard=cards[0]?.getBoundingClientRect();
        if(innerWidth===390 && firstCard && firstCard.width<147.5) errors.push('flavor cards below 148px');
        const overflowing=[...active.querySelectorAll('*')].filter(e=>e.clientWidth>0 && e.scrollWidth>e.clientWidth+1)
          .slice(0,8).map(e=>({tag:e.tagName,class:e.className,client:e.clientWidth,scroll:e.scrollWidth,text:e.textContent.trim().slice(0,80)}));
        return {category:tab.textContent.trim(),errors,cropped,overflowing,
          frame:{navLeft:nr.left,navRight:nr.right,panelLeft:pr.left,panelRight:pr.right},
          headingTop:heading.top,navBottom:nr.bottom,labelLeft:lr.left,labelRight:lr.right,
          firstCardWidth:firstCard?.width};
      })()`);
      results.push({width,height,...result});
      if (width === 320 || width === 390 || result.errors.length) {
        const shot = await call('Page.captureScreenshot', { format:'png' });
        await writeFile(`${output}/${width}-${height}-tab-${tab}.png`, Buffer.from(shot.data,'base64'));
      }
      console.log(`${result.errors.length?'FAIL':'PASS'} ${width}x${height} ${result.category} ${result.errors.join('; ')}`);
    }
  }
  // Desktop breakpoint remains unchanged; the horizontal phone bar stays hidden.
  for (const width of [768,1024,1440]) {
    await call('Emulation.setDeviceMetricsOverride', {width,height:900,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate', {url:`${origin}/#menu`});
    await wait(850);
    const hidden=await evaluate("document.querySelector('.menu-category-mobile').getBoundingClientRect().width===0");
    results.push({width,height:900,category:'desktop breakpoint',errors:hidden?[]:['phone category bar exposed on desktop']});
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results,null,2));
  const failures=results.filter(r=>r.errors.length);
  console.log(JSON.stringify({states:results.length,failures:failures.length,output}));
  if(failures.length) process.exitCode=1;
} finally {
  clearTimeout(watchdog);
  browser?.close();
  chrome.kill();
}
