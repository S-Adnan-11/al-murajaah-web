import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const r=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8'));
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const data=JSON.parse(html.split('<script type="application/ld+json">')[1].split('</script>')[0]);
const nodes=data['@graph']||[data],sites=nodes.filter(n=>n['@type']==='WebSite'),app=nodes.find(n=>n['@type']==='SoftwareApplication');
assert.equal(sites.length,1);assert.equal(sites[0].name,'Al-Murāja’ah');assert.equal(sites[0].url,'https://al-murajaah.devs.surf/');assert.deepEqual(sites[0].alternateName,['Al-Murajaah',"Al-Muraja'ah",'المراجعة']);
assert.equal(app.softwareVersion,r.version);assert.equal(app.downloadUrl,r.apkUrl);assert.equal(app.fileSize,r.bytes+' bytes');assert(html.includes('data-release-version>'+r.version+'+'+r.build));assert(html.includes('data-release-size>'+r.sizeLabel));assert(!html.includes('noindex'));assert(!html.includes('aggregateRating'));assert(!html.includes(' download='));
for(const f of ['index.html','notices.html','404.html']){const s=fs.readFileSync(path.join(dist,f),'utf8');for(const m of s.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1];if(/^(https?:|mailto:)/.test(ref)||ref==='./'||ref==='/')continue;assert(fs.existsSync(path.join(dist,ref.replace(/^\//,'')+(ref==='/notices'?'.html':''))),f+': missing '+ref)}}
const css=fs.readFileSync(path.join(dist,'styles.css'),'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))assert(fs.existsSync(path.join(dist,m[1])),'Missing CSS asset '+m[1]);
assert(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes('Sitemap: https://al-murajaah.devs.surf/sitemap.xml'));const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');assert.equal([...sitemap.matchAll(/<loc>/g)].length,2);assert(!sitemap.includes('404'));assert(sitemap.includes('<loc>https://al-murajaah.devs.surf/notices</loc>'));assert(!sitemap.includes('notices.html'));
const icon=fs.readFileSync(path.join(dist,'assets/icon-192.png'));assert.equal(icon.readUInt32BE(16),192);assert.equal(icon.readUInt32BE(20),192);assert(html.includes('rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png"'));
assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert(html.includes('rel="canonical" href="https://al-murajaah.devs.surf/"'));assert(html.includes('property="og:site_name" content="Al-Murāja’ah"'));assert(html.includes('lang="ar" dir="rtl"'));assert(fs.existsSync(path.join(dist,'assets/Cairo-OFL.txt')));
const js=fs.readFileSync(path.join(dist,'app.js'),'utf8');assert(!/alert\s*\(|fetch\s*\(|serviceWorker|new Audio|sendBeacon/.test(js));
console.log('PASS: release consistency, local paths, CSS assets, JSON-LD syntax, sitemap, robots, Arabic attributes, OFL and runtime boundaries.');
