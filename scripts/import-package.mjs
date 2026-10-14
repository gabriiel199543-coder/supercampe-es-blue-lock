import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
export function extractZip(bytes){
 let end=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(bytes.readUInt32LE(i)===0x06054b50){end=i;break;}}
 if(end<0)throw Error('ZIP inválido.');const count=bytes.readUInt16LE(end+10);let cursor=bytes.readUInt32LE(end+16),total=0;const files=new Map();if(count>512)throw Error('Pacote grande demais.');
 for(let i=0;i<count;i++){
  if(bytes.readUInt32LE(cursor)!==0x02014b50)throw Error('Diretório ZIP inválido.');
  const flags=bytes.readUInt16LE(cursor+8),method=bytes.readUInt16LE(cursor+10),size=bytes.readUInt32LE(cursor+20),length=bytes.readUInt32LE(cursor+24),nameLen=bytes.readUInt16LE(cursor+28),extra=bytes.readUInt16LE(cursor+30),comment=bytes.readUInt16LE(cursor+32),offset=bytes.readUInt32LE(cursor+42);
  const name=bytes.subarray(cursor+46,cursor+46+nameLen).toString('utf8');cursor+=46+nameLen+extra+comment;
  if(name.startsWith('/')||name.includes('\\')||name.split('/').includes('..')||name.includes(':'))throw Error('Caminho inseguro no ZIP.');
  if(flags&1||![0,8].includes(method)||length>8*1024*1024||(total+=length)>32*1024*1024)throw Error('Formato de pacote não suportado.');
  if(name.endsWith('/'))continue;
  if(bytes.readUInt32LE(offset)!==0x04034b50)throw Error('Entrada ZIP inválida.');const start=offset+30+bytes.readUInt16LE(offset+26)+bytes.readUInt16LE(offset+28);
  const compressed=bytes.subarray(start,start+size);const raw=method===0?compressed:inflateRawSync(compressed,{maxOutputLength:8*1024*1024});if(raw.length!==length)throw Error('Tamanho de arquivo inválido.');files.set(name,raw);
 }return files;
}
export function validatePackage(files){
 const json=f=>{if(!files.has(f))throw Error('Arquivo obrigatório ausente: '+f);return JSON.parse(files.get(f).toString('utf8'));};
 const manifest=json('manifest.json');for(const f of manifest.files){const bytes=files.get(f.path);if(!bytes||bytes.length!==f.bytes||createHash('sha256').update(bytes).digest('hex')!==f.sha256)throw Error('Falha de integridade: '+f.path);}
 const bank=json('dados/jogadores/jogadores_110.json'),clubs=json('dados/clubes/clubes_exemplo_20_coerentes.json');
 if(bank.players?.length!==110||new Set(bank.players.map(p=>p.id)).size!==110||new Set(bank.players.map(p=>p.power.id)).size!==110||clubs.length!==20)throw Error('O pacote precisa conter 110 jogadores únicos, 110 poderes e 20 clubes.');
 return{bank,clubs};
}
export async function importPackage(zipPath,root){
 const files=extractZip(await readFile(zipPath));const {bank}=validatePackage(files);
 const targets=['dados/jogadores/jogadores_110.json','dados/jogadores/roster_compat_110.json','dados/clubes/clubes_exemplo_20_coerentes.json','dados/clubes/parametros_criador_clubes_v1.json','dados/clubes/config_coerencia_v1_1.json','dados/game_design/parametros_game_design_v1.json','config/online_1x1_v1.json'];
 for(const target of targets){const dest=path.resolve(root,target);if(!dest.startsWith(path.resolve(root)+path.sep))throw Error('Destino inválido.');await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,files.get(target));}
 await writeFile(path.join(root,'dados/jogadores/roster-compat.js'),'window.BANCO_ROSTER_110='+JSON.stringify(bank.legacyRosterRows)+';\n');
 return{players:bank.players.length,clubs:20};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const root=fileURLToPath(new URL('../',import.meta.url));const argument=process.argv[2]||(await readdir(root)).find(f=>/^Manager_Online_1x1_Pacote_Completo_v2.*\.zip$/i.test(f));
 if(!argument){console.error('Coloque o ZIP Manager_Online_1x1_Pacote_Completo_v2 na pasta do projeto e rode npm run import, ou informe o caminho após --.');process.exitCode=1;}
 else{try{const result=await importPackage(path.resolve(root,argument),root);console.log('Importado: '+result.players+' jogadores e '+result.clubs+' clubes, sem alterar nomes, atributos ou assinaturas.');}catch(error){console.error(error.message);process.exitCode=1;}}
}
