// Development only. Install: npm install --prefix .preview/tooling --no-save --package-lock=false --ignore-scripts sharp@0.35.5
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, '.preview/tooling/tool.cjs'));
const sharp = require('sharp');
const dir = path.join(root, 'docs/favicon');
const navy = '#071322';
const source = path.join(dir, 'main-blue.png');
const {data, info} = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject: true});
let left = info.width, top = info.height, right = 0, bottom = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  if (data[(y * info.width + x) * 4 + 3]) {
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
}
// Reuse the original alpha silhouette exactly. Change only its colour and canvas.
for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = 255;
const mark = await sharp(data, {raw: info}).extract({left, top, width: right-left+1, height: bottom-top+1}).png().toBuffer();
const metrics = [];
for (const size of [32, 180, 192, 512]) {
  // One uniform scale; contain the entire silhouette in 80% of the square.
  const fitted = await sharp(mark).resize({width: Math.round(size * .8), height: Math.round(size * .8), fit: 'inside', kernel: 'lanczos3'}).toBuffer();
  const meta = await sharp(fitted).metadata();
  const x = Math.floor((size - meta.width) / 2), y = Math.floor((size - meta.height) / 2);
  const output = path.join(root, `dist/assets/icon-${size}.png`);
  await sharp({create: {width: size, height: size, channels: 3, background: navy}}).composite([{input: fitted, left: x, top: y}]).png().toFile(output);
  const {data: alpha, info: a} = await sharp(fitted).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  let radius = 0;
  for (let ay = 0; ay < a.height; ay++) for (let ax = 0; ax < a.width; ax++) {
    if (alpha[(ay*a.width+ax)*4+3] > 16) radius = Math.max(radius, Math.hypot(x+ax+.5-size/2, y+ay+.5-size/2));
  }
  if (radius >= size/2 - .5) throw new Error(`Circular crop clips ${size}px mark`);
  metrics.push({size, markWidth: meta.width, markHeight: meta.height, circleClearancePx: +(size/2-radius).toFixed(2)});
}

const svg = (s) => Buffer.from(s);
for (const sourceSize of [32, 192]) {
  const width = 860, height = 458, overlays = [];
  const cases = [ ['Light', '#f7f7f7', false], ['Dark', '#202124', false], ['Circle / light', '#f7f7f7', true], ['Circle / dark', '#202124', true] ];
  const labels = ['<text x="24" y="30" font-size="20" font-weight="bold">Favicon before / after · '+sourceSize+'px asset</text>', '<text x="24" y="53" font-size="12">Actual display sizes. Each pair: before (left), after (right). No letterform changes.</text>'];
  for (let c = 0; c < cases.length; c++) {
    const [label, bg, circle] = cases[c], cx = 110 + c*182;
    labels.push(`<text x="${cx+84}" y="87" text-anchor="middle" font-size="13">${label}</text>`);
    for (const [r, size] of [16,24,32,48].entries()) {
      const cy = 104+r*80;
      overlays.push({input: svg(`<svg width="168" height="72"><rect width="168" height="72" rx="6" fill="${bg}"/></svg>`), left: cx, top: cy});
      for (const [i, which] of ['before','after'].entries()) {
        const filename = which === 'before' ? path.join(dir, `before/icon-${sourceSize}.png`) : path.join(root, `dist/assets/icon-${sourceSize}.png`);
        let pixels = await sharp(filename).resize(size,size,{kernel:'lanczos3'}).ensureAlpha().png().toBuffer();
        if (circle) pixels = await sharp(pixels).composite([{input:svg(`<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`),blend:'dest-in'}]).png().toBuffer();
        overlays.push({input:pixels,left:cx+42+i*84-Math.floor(size/2),top:cy+36-Math.floor(size/2)});
      }
    }
  }
  for (const [r,size] of [16,24,32,48].entries()) labels.push(`<text x="24" y="${145+r*80}" font-size="15">${size}px</text>`);
  labels.push('<text x="24" y="447" font-size="11">32px source is enlarged at 48px; 192px source is downsampled throughout. Browser rendering may vary.</text>');
  const canvas=svg(`<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/><g font-family="Arial, sans-serif" fill="#172232">${labels.join('')}</g></svg>`);
  await sharp(canvas).composite(overlays).png().toFile(path.join(dir,`comparison-${sourceSize}.png`));
}
const linear = c => {c/=255; return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;};
const luminance = .2126*linear(7)+.7152*linear(19)+.0722*linear(34);
console.log(JSON.stringify({sourceBounds:{left,top,right,bottom},contrast:+(1.05/(luminance+.05)).toFixed(2),metrics},null,2));
