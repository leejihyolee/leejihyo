import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {resolveOrigin,build} from '../scripts/build.mjs';

test('public sharing always uses the production domain instead of a protected preview URL',()=>{
  assert.equal(resolveOrigin({VERCEL_PROJECT_PRODUCTION_URL:'snu-quiz.example.invalid',VERCEL_URL:'preview-123.example.invalid'}),'https://snu-quiz.example.invalid');
});
test('a custom public domain overrides the platform URL',()=>{
  assert.equal(resolveOrigin({PUBLIC_SITE_URL:'https://quiz.example.invalid/',VERCEL_PROJECT_PRODUCTION_URL:'old.example.invalid'}),'https://quiz.example.invalid');
});
test('missing or malformed origins fail before generating broken preview metadata',()=>{
  assert.throws(()=>resolveOrigin({}));
  for(const url of ['javascript:alert(1)','https://name:password@example.invalid/','https://example.invalid/wrong-path']) assert.throws(()=>resolveOrigin({PUBLIC_SITE_URL:url}));
});
test('export replaces preview metadata and the share button URL, and carries all event assets',async()=>{
  const output=await build({PUBLIC_SITE_URL:'https://quiz-build-test.invalid'});
  const html=await readFile(path.join(output,'index.html'),'utf8');
  const app=await readFile(path.join(output,'app.mjs'),'utf8');
  assert.match(html,/og:image[^>]+https:\/\/quiz-build-test\.invalid\/assets\/share-preview\.jpg/);
  assert.match(app,/SHARE_URL = 'https:\/\/quiz-build-test\.invalid\/'/);
  assert.doesNotMatch(html+app,/chatgpt|__SITE_ORIGIN__/i);
  for(const asset of ['goldenbell-poster.jpg','share-preview.jpg','event-card-1.png','event-card-2.png','event-card-3.png','exam-fallback.woff']) assert.ok((await stat(path.join(output,'assets',asset))).size>0);
  assert.ok((await stat(path.join(output,'end-pages.mjs'))).size>0);
  assert.match(app,/from '\.\/end-pages\.mjs'/);
});
