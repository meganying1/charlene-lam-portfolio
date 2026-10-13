// Sites preview adapter: retain original PDFs while respecting a per-file asset cap.
// The portable dist/ build keeps ordinary PDF files for independent static hosts.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
fs.rmSync('build',{recursive:true,force:true});fs.cpSync('dist','build',{recursive:true});
const adapted=[];
for(const file of fs.readdirSync('build/_files/ugd')){
 const target=path.join('build/_files/ugd',file),bytes=fs.readFileSync(target);
 if(bytes.length<=25*1024*1024)continue;
 const prefix='/preview-pdf-parts/'+file;const parts=[];const pieces=[];
 fs.mkdirSync('build'+prefix,{recursive:true});
 for(let offset=0;offset<bytes.length;offset+=8*1024*1024){const part=bytes.subarray(offset,Math.min(offset+8*1024*1024,bytes.length));const url=prefix+'/'+parts.length+'.bin';fs.writeFileSync('build'+url,part);parts.push(url);pieces.push(part);}
 if(!Buffer.concat(pieces).equals(bytes))throw Error('PDF byte preservation failed');
 fs.unlinkSync(target);fs.mkdirSync(target);
 const title=file.replaceAll('&','&amp;').replaceAll('<','&lt;');
 fs.writeFileSync(path.join(target,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font:16px/1.5 Helvetica,Arial,sans-serif;margin:24px"><p id="status" role="status">Loading PDF…</p><a id="open" hidden>Open PDF</a> <a id="download" hidden>Download PDF</a><script type="module">const parts=${JSON.stringify(parts)};try{const buffers=await Promise.all(parts.map(async path=>{const r=await fetch(path);if(!r.ok)throw Error(r.status);return r.arrayBuffer()}));const blob=new Blob(buffers,{type:'application/pdf'});const url=URL.createObjectURL(blob);document.getElementById('status').remove();for(const id of ['open','download']){const a=document.getElementById(id);a.href=url;a.hidden=false;}document.getElementById('download').download=${JSON.stringify(file)};document.getElementById('open').target='_blank';}catch(error){document.body.textContent='The PDF could not load. Please reload this page.';}</script></body></html>`);
 adapted.push({path:'/_files/ugd/'+file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(Buffer.concat(pieces)).digest('hex'),parts});
}
fs.writeFileSync('build/preview-pdf-adapter.json',JSON.stringify(adapted,null,2));console.log('Prepared private preview; original PDF bytes verified:',adapted.length);
