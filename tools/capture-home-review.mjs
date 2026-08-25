import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = path.resolve('.impeccable/review/journey-shot');
fs.mkdirSync(out, { recursive: true });
const port = 9333;
const proc = spawn(chrome, [`--headless=new`,`--remote-debugging-port=${port}`,`--user-data-dir=${path.join(out,'chrome-profile')}`,'--disable-background-networking','--hide-scrollbars','--window-size=1440,1000','about:blank'], { stdio:'ignore' });
const wait = ms => new Promise(r=>setTimeout(r,ms));
function getJson(url){return new Promise((resolve,reject)=>http.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>resolve(JSON.parse(d)));}).on('error',reject));}
let ready=false; for(let n=0;n<15&&!ready;n++){await wait(400);ready=await getJson(`http://localhost:${port}/json/version`).then(()=>true).catch(()=>false)}
const list=await getJson(`http://localhost:${port}/json`); const tab=list[0];
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0; const pending=new Map(); ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}});
const call=(method,params={})=>new Promise(resolve=>{const n=++id;pending.set(n,resolve);ws.send(JSON.stringify({id:n,method,params}))});
await call('Page.enable'); await call('Runtime.enable'); await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await call('Page.navigate',{url:'http://localhost:3000/'}); await wait(2400);
for (const [name,y] of [['00',0],['01',950],['02',1900],['03',2850],['04',3900],['05',5000]]){
 await call('Runtime.evaluate',{expression:`window.scrollTo(0,${y})`}); await wait(900);
 const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); fs.writeFileSync(path.join(out,`desktop-${name}.png`),Buffer.from(shot.data,'base64'));
}
await call('Emulation.setDeviceMetricsOverride',{width:430,height:932,deviceScaleFactor:1,mobile:true}); await call('Page.navigate',{url:'http://localhost:3000/'}); await wait(2200);
for (const [name,y] of [['00',0],['02',1500],['04',3200]]){await call('Runtime.evaluate',{expression:`window.scrollTo(0,${y})`});await wait(900);const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`mobile-${name}.png`),Buffer.from(shot.data,'base64'));}
ws.close();proc.kill();console.log('captured',fs.readdirSync(out));
