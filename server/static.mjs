import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
export async function createAppServer({root=projectRoot}={}){
 const roster=JSON.parse(await readFile(path.join(root,'dados/jogadores/roster_compat_110.json'),'utf8'));
 const clubs=JSON.parse(await readFile(path.join(root,'dados/clubes/clubes_exemplo_20_coerentes.json'),'utf8'));
 if(roster.length!==110||clubs.length!==20)throw Error('Banco incompleto: esperado 110 jogadores e 20 clubes.');
 return http.createServer(async(req,res)=>{
  try{
   if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Método não permitido.');}
   const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
   if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});return res.end(JSON.stringify({ok:true,version:'0.4.0',mode:'prototype-data-clubs',players:roster.length,clubs:clubs.length,multiplayer:false}));}
   const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,'');
   const allowed=['index.html','clubes.html'].includes(relative)||['public/','shared/','dados/','legacy/'].some(prefix=>relative.startsWith(prefix));
   const file=path.resolve(root,relative),base=path.resolve(root)+path.sep;
   if(!allowed||!file.startsWith(base)||relative.split(/[\/\\]/).some(p=>p.startsWith('.'))||!types[path.extname(file)]){res.writeHead(404);return res.end('Página não encontrada.');}
   const info=await stat(file);if(!info.isFile()||info.size>8*1024*1024){res.writeHead(404);return res.end('Arquivo indisponível.');}
   const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]+'; charset=utf-8','Content-Length':bytes.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});
   res.end(req.method==='HEAD'?undefined:bytes);
  }catch(error){res.writeHead(error.code==='ENOENT'?404:400,{'Content-Type':'text/plain; charset=utf-8'});res.end('Não foi possível abrir esta página.');}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const port=Number(process.env.PORT||3000);if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT deve estar entre 1 e 65535.');
 const server=await createAppServer();server.on('error',error=>{console.error('Não foi possível iniciar o jogo: '+error.message);process.exitCode=1;});
 server.listen(port,'0.0.0.0',()=>console.log('Jogo: http://localhost:'+port+' · Criador de clubes: http://localhost:'+port+'/clubes.html'));
}
