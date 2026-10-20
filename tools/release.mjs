// Maintainer tool only. No browser fetch, dependency or APK copying.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const r=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8'));
const version=r.version+'+'+r.build;
const f=path.join(root,'dist/index.html');let html=fs.readFileSync(f,'utf8');
html=html.replace(/href="https:\/\/github.com\/S-Adnan-11\/al-murajaah\/releases\/download\/[^\"]+\.apk"/g,'href="'+r.apkUrl+'"').replace(/data-release-version>[^<]+/g,'data-release-version>'+version).replace(/data-release-size>[^<]+/g,'data-release-size>'+r.sizeLabel).replace(/data-release-link href="[^"]+"/g,'data-release-link href="'+r.releaseUrl+'"');
const prefix='<script type="application/ld+json">', raw=html.split(prefix)[1].split('</script>')[0];
const data=JSON.parse(raw);data.softwareVersion=r.version;data.downloadUrl=r.apkUrl;data.fileSize=r.bytes+' bytes';
html=html.replace(prefix+raw,prefix+JSON.stringify(data));
fs.writeFileSync(f,html);console.log('Updated static download markup from release.json. Review and verify live metadata before publication.');
