# Al-Murāja’ah download website

Static showcase for https://al-murajaah.devs.surf/. Prepared 2026-10-20 from approved mobile source a476f3c8bbd22cfbff55c06dc5bd98ef0605031f, released Android 1.0.1+36. **Local review only: no website repository, deployment, DNS change or indexing submission has happened.**

The mobile app is https://github.com/S-Adnan-11/al-murajaah. Public feedback is https://github.com/S-Adnan-11/al-murajaah-feedback/issues (a separate repository). Worker implementation remains in the mobile app's services/feedback-worker directory. This website will have its own repository supplied by the owner; do not infer its URL or put it in either app or private backup source history.

## Preview and checks

No build or package install is needed. Open dist/index.html directly, or with Node 22+ run:

```text
node tools/serve.mjs
node tools/check.mjs
node --check dist/app.js
```

Preview: http://127.0.0.1:4173/. Node is a development tool only. The preview handles missing paths with HTTP 404 and the branded 404 page; deployment hosts must be configured similarly. Serve **dist/** as the document root. There are no runtime packages, server endpoints, bundler, environment values, cookies, analytics, service worker or PWA flow. Radio controls and the direct APK link work without JavaScript; theme selection, automatic language rotation, pause and store status messages use JS. Without JS, visible store labels and the noscript message explain unavailability.

## Release updates

release.json keeps version/build, bytes, size label, asset URL, release URL, SHA-256 and verification date together. Verify GitHub's release API and HEAD redirect before editing it. Run node tools/release.mjs to update the static main link, displayed version/size and structured data, then node tools/check.mjs. Review the rendered HTML, checksum link and metadata. The website never fetches the APK in JavaScript, never claims a click completed a download and does not rely on the cross-origin download attribute. Do not copy the APK into this repository. MB is decimal: 67,083,223 bytes displays as 67.1 MB (about 64.0 MiB); recordings are separate.

Screenshot version captions intentionally describe the captured build and must not be relabeled when updating a download. Replace screenshots only with verified approved captures. Source hashes and transformations are in asset-provenance.json. The English/Arabic reminder is copied exactly from HomeReading in the source baseline, including tashkeel and unusual punctuation. It switches after 6,500ms readable dwell, pauses offscreen/hidden and disables automatic switching with reduced motion. Manual native language radios always remain available. Overlaid grid panels reserve the larger language height.

## Publish only after owner instruction

See HOSTING.md. Commit/push, host selection, domain attachment, DNS, verification values and deployment need the owner's separate instruction. Review exact files first. Publish dist/** only; tools, this README and provenance can be source files but do not need to be served. Never include private guides, credentials, diagnostic evidence, APKs or app backups. See PUBLIC-FILES.txt for the exact proposed source inventory.

## Credits and limitations

First-party website code: MIT, © 2026 S. Adnan. Brand artwork/screenshots are approved project assets, not generally licensed for downstream redistribution. Cairo is unmodified and distributed with its OFL/copyright notice. No audio/portrait is republished. notices.html records attribution. Platform buttons use original outline illustrations rather than official store badges; they explicitly say Not available yet and do not imply store endorsement. No reviews, usage counts or store launch promises are asserted.

Chrome emulation is not physical phone, Safari, Firefox, TalkBack or VoiceOver acceptance. The custom share image can be inspected locally, but real social previews require a public deployment and platform cache refresh. Production HTTP/TLS/DNS, Search Console and indexing remain pending.
