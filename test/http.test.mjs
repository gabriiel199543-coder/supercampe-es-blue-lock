import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppServer} from '../server/static.mjs';
test('servidor inicia, entrega jogo/dados e fecha sem erros',async()=>{
 const app=await createAppServer();await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
 try{const base='http://127.0.0.1:'+app.address().port;
 const health=await fetch(base+'/health');assert.equal(health.status,200);const body=await health.json();assert.equal(body.players,110);assert.equal(body.clubs,20);assert.equal(body.multiplayer,false);
 for(const route of ['/','/clubes.html','/shared/clubs.mjs','/dados/jogadores/roster-compat.js','/legacy/index.html']){const response=await fetch(base+route);assert.equal(response.status,200,route);assert.ok((await response.text()).length>0);}
 for(const route of ['/package.json','/.env','/config/online_1x1_v1.json','/nao-existe','/%2e%2e%2fpackage.json'])assert.equal((await fetch(base+route)).status,404,route);
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 }finally{await new Promise(resolve=>app.close(resolve));}
});
