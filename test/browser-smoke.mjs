import {createAppServer} from '../server/static.mjs';
import assert from 'node:assert/strict';
let chromium;try{({chromium}=await import('playwright'));}catch{console.error('Instale a ferramenta de teste: npm install --no-save playwright; npx playwright install chromium');process.exit(1);}
const app=await createAppServer();await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.address().port;
let browser;try{
 browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base);await page.getByRole('button',{name:'Elenco',exact:true}).click();await page.locator('#squadTable tr').first().waitFor();assert.equal(await page.locator('#squadTable tr').count(),25);
 await page.getByRole('button',{name:'Visão geral',exact:true}).click();await page.locator('#managerTeam').selectOption('mundo');await page.getByRole('button',{name:'Elenco',exact:true}).click();assert.equal(await page.locator('#squadTable tr').count(),35);
 await page.locator('[data-player-profile]').first().click();await page.locator('#screen-skills').waitFor({state:'visible'});await page.locator('#skillSetFocus').click();await page.locator('#screen-training').waitFor({state:'visible'});await page.locator('#trainWeek').click();assert.equal(await page.locator('#week').innerText(),'2');
 await page.getByRole('button',{name:'Dia de jogo',exact:true}).click();await page.locator('#simulateSegment').click();assert.equal(await page.locator('#minute').innerText(),'15');await page.locator('#applySub').click();assert.ok((await page.locator('#subsStatus').innerText()).startsWith('1/5'));await page.locator('#simulateMatch').click();assert.equal(await page.locator('#minute').innerText(),'90');assert.equal(await page.locator('#matchStatus').innerText(),'Encerrado');
 await page.goto(base+'/clubes.html');await page.locator('#clubName').waitFor();await page.waitForFunction(()=>document.querySelector('#preset').options.length===21);assert.equal(await page.locator('#preset option').count(),21);
 await page.locator('#preset').selectOption('custom-example-001');await page.locator('[data-field="clubName"]').fill('Gabriel FC');await page.locator('[data-field="clubName"]').dispatchEvent('change');await page.locator('#visual').click();assert.equal(await page.locator('#clubName').innerText(),'Gabriel FC');await page.locator('#save').click();
 await page.goto(base);assert.equal(await page.locator('#managedName').innerText(),'Gabriel FC');
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/clubes.html');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));assert.deepEqual(errors,[]);
 console.log('PASS: navegador, 110 atletas, treino, substituição, partida 90min, 20 clubes, editor e identidade.');
}finally{await browser?.close();await new Promise(resolve=>app.close(resolve));}
