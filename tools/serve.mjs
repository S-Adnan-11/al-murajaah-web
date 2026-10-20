import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const server=http.createServer((req,res)=>{let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end('Bad request');return}let file=path.resolve(root,'.'+(p==='/'?'/index.html':p));if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}let status=200;try{if(!fs.statSync(file).isFile())throw Error()}catch{file=path.join(root,'404.html');status=404}res.writeHead(status,{'Content-Type':types[path.extname(file)]||'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});if(req.method==='HEAD'){res.end();return}fs.createReadStream(file).pipe(res)});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+server.address().port));
