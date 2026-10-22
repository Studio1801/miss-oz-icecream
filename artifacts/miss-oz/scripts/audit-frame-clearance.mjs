/**
 * Read-only cross-page text/frame clearance audit. No form submissions.
 * node artifacts/miss-oz/scripts/audit-frame-clearance.mjs
 * AUDIT_WIDTHS and AUDIT_ROUTES optionally limit a targeted rerun.
 * Evidence goes to /tmp, never the deployed app.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const origin = process.env.AUDIT_URL || 'http://127.0.0.1:80';
const output = await mkdtemp(`${tmpdir()}/miss-oz-frame-clearance-`);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
  '--remote-debugging-port=9535', '--remote-allow-origins=*',
  `--user-data-dir=${output}/profile`, 'about:blank',
], { stdio: 'ignore' });
let browser, sequence = 0;
const pending = new Map(), results = [];
const watchdog = setTimeout(() => { chrome.kill(); process.exit(2); }, 240_000);

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(method)); }, 20_000);
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

function audit() {
  const width = document.documentElement.clientWidth;
  const safe = 3 + Math.min(26, Math.max(14, width * 0.02)) + 8;
  const findings = [];
  if (document.documentElement.scrollWidth > width + 1) findings.push({ kind:'page overflow', width:document.documentElement.scrollWidth });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim(), parent = node.parentElement;
    if (!text || parent.closest('script,style,svg,.sr-only,[aria-hidden="true"],[data-marquee],[data-hscroll]')) continue;
    if (!parent.checkVisibility({ checkOpacity:true, checkVisibilityCSS:true })) continue;
    const range = document.createRange(); range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (!rect.width || !rect.height) continue;
      if (rect.left < safe - 1 || rect.right > width - safe + 1) {
        findings.push({ kind:'frame clearance',text:text.slice(0,85),left:rect.left,right:rect.right,safe });
        break;
      }
      let clipped = false;
      for (let ancestor=parent; ancestor && ancestor!==document.body; ancestor=ancestor.parentElement) {
        const style=getComputedStyle(ancestor);
        if (!['hidden','clip','auto','scroll'].includes(style.overflowX)) continue;
        const clip=ancestor.getBoundingClientRect();
        if (rect.left < clip.left-1 || rect.right > clip.right+1) {
          findings.push({kind:'clipped text',text:text.slice(0,85),ancestor:ancestor.className});
          clipped=true; break;
        }
      }
      if(clipped) break;
    }
  }
  const story=document.querySelector('.story-stamp')?.parentElement;
  if(story) {
    const frame=story.getBoundingClientRect(), required=width<768?24:30;
    const walker=document.createTreeWalker(story,NodeFilter.SHOW_TEXT);
    let text;
    while((text=walker.nextNode())) {
      if(!text.textContent.trim() || !text.parentElement.closest('p') || text.parentElement.closest('[aria-hidden="true"]')) continue;
      const r=document.createRange();r.selectNodeContents(text);
      if([...r.getClientRects()].some(b=>b.width && (b.left<frame.left+required-1 || b.right>frame.right-required+1))) {
        findings.push({kind:'story inner-frame clearance',text:text.textContent.trim().slice(0,85)});
      }
    }
  }
  const badge=[...document.querySelectorAll('.new-flavor-badge-label')].map(label=>{
    const range=document.createRange();range.selectNodeContents(label);
    const rects=[...range.getClientRects()].filter(r=>r.width && r.height);
    const inner=label.parentElement.getBoundingClientRect();
    const fits=rects.every(r=>r.left>=inner.left-1 && r.right<=inner.right+1 && r.top>=inner.top-1 && r.bottom<=inner.bottom+1);
    const result={text:label.textContent.trim(),lines:rects.length,fits};
    if(rects.length!==1 || !fits) findings.push({kind:'badge word split/clipping',...result});
    return result;
  });
  return {width,findings,badge};
}

try {
  let pages;
  for(let i=0;i<100;i++) {
    try { pages=await fetch('http://127.0.0.1:9535/json').then(r=>r.json());if(pages.some(p=>p.type==='page'))break; } catch {}
    await wait(100);
  }
  browser=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>{browser.onopen=resolve;});
  browser.onmessage=event=>{const m=JSON.parse(event.data);pending.get(m.id)?.(m);pending.delete(m.id);};
  await call('Page.enable');await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:"sessionStorage.setItem('miss-oz-intro-seen','1');"});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const widths=(process.env.AUDIT_WIDTHS || '320,390,430,767,768,1024,1440').split(',').map(Number);
  const routes=(process.env.AUDIT_ROUTES || '/,/about,/events,/wholesale,/contact').split(',');
  for(const width of widths) for(const route of routes) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
    await call('Page.navigate',{url:`${origin}${route}`});
    await wait(500);
    let ready=false;
    for(let i=0;i<100;i++) {
      if(await evaluate("!!document.querySelector('.page-route-content h2')")){ready=true;break;}
      await wait(100);
    }
    if(!ready)throw new Error(`Page did not load: ${route}`);
    await evaluate(`(async()=>{
      await document.fonts.ready;
      for(const img of document.images) img.loading='eager';
      await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,1500))]);
      for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*0.8){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}
      window.scrollTo({top:0,behavior:'instant'});
    })()`);
    await wait(180);
    const result=await evaluate(`(${audit.toString()})()`);
    results.push({route,...result});
    console.log(`${result.findings.length?'CHECK':'PASS'} ${width} ${route}: ${result.findings.length}`);
    if(width===390 && (route==='/' || route==='/about')) {
      await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(route==='/'?'#new-flavor':'.story-stamp')});const p=${route==='/'?'e':'e.parentElement'};window.scrollTo({top:scrollY+p.getBoundingClientRect().top-120,behavior:'instant'});})()`);
      await wait(250);
      const shot=await call('Page.captureScreenshot',{format:'png'});
      await writeFile(`${output}/${route==='/'?'new-flavor':'story'}-390.png`,Buffer.from(shot.data,'base64'));
    }
  }
  await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify({states:results.length,statesToReview:results.filter(r=>r.findings.length).length,output}));
  if(results.some(r=>r.findings.length))process.exitCode=1;
} finally {clearTimeout(watchdog);browser?.close();chrome.kill();}
