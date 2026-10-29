import {cp,readFile,writeFile,rm,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

export function resolveOrigin(env) {
  const candidate=env.PUBLIC_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  if(!candidate) throw new Error('A site URL is required. Vercel supplies VERCEL_PROJECT_PRODUCTION_URL automatically. For local builds, set PUBLIC_SITE_URL.');
  const url=new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
  if(!['http:','https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname!=='/') throw new Error('Use the origin of the website, for example https://your-project.vercel.app.');
  return url.origin;
}

async function replaceOrigin(directory,origin) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()) await replaceOrigin(file,origin);
    else if(/\.(html|mjs)$/.test(entry.name)) await writeFile(file,(await readFile(file,'utf8')).replaceAll('__SITE_ORIGIN__',origin));
  }
}

export async function build(env=process.env) {
  const origin=resolveOrigin(env);
  const output=path.join(root,'public');
  await rm(output,{recursive:true,force:true});
  await cp(path.join(root,'src'),output,{recursive:true});
  await replaceOrigin(output,origin);
  console.log(`Static quiz built for ${origin}`);
  return output;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  build().catch(error=>{console.error(error.message);process.exitCode=1;});
}
