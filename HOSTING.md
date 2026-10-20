# Static hosting and search handoff

Prepared 2026-10-20. Production target: https://al-murajaah.devs.surf/. Host and website repository are not selected/provided. Nothing has been deployed or registered by this task. Do not assume ownership of devs.surf or another project's host.

## Once the owner selects a host

1. Review the source inventory and create/connect the separately supplied website repository only with authorization. Use a static host that supports a custom subdomain, HTTPS, correct MIME types and custom HTTP 404. There is no build command; publish directory is dist. Avoid SPA catch-all rewrites to index.html.
2. Deploy a preview deliberately, test its paths and error statuses, then attach the exact custom domain al-murajaah.devs.surf in that host. Record the host project identifier and recovery/admin location privately. A separate preview hostname should not become the canonical production URL. If a staging noindex header is used, remove it on production.
3. Ask the subdomain/DNS administrator to set the exact CNAME, A/AAAA or delegated-zone records supplied by the selected host. Do not guess targets, change parent/apex records or copy another project's configuration. Set any ownership record exactly as provided. If a conflicting CNAME exists, coordinate with its owner; do not overwrite it speculatively.
4. Wait for DNS and certificate validation. Redirect HTTP to HTTPS and any selected alternate hostname to the single canonical URL. Serve / and /notices.html as 200; /missing-page and /assets/missing.png as **404**, rendering 404.html for human navigation. Never rewrite missing JS/CSS/images to 200 HTML. Keep assets' MIME types correct (text/css, text/javascript, font/ttf, image/webp, image/png), XML and robots text accessible. The preview server demonstrates status behavior; it is not a production server.
5. Ensure the landing page, notices, images, CSS, font, robots.txt and sitemap.xml have no authentication/challenge gate, robots block, accidental noindex or X-Robots-Tag restriction. No cookie banner is needed for the current site. Review the actual host's logging/privacy terms before publication and update privacy text if that host adds processing beyond ordinary access logs. Do not enable injected analytics.
6. Prefer short revalidation for HTML, CSS and JS because filenames are not content hashed. Only use immutable long caching after adding versioned filenames. Optional response hardening: X-Content-Type-Options nosniff and Referrer-Policy strict-origin-when-cross-origin. Any CSP must permit same-origin fonts/styles/scripts and the inline JSON-LD; validate it before enforcing. No third-party scripts are required.
7. Check the actual direct APK anchor/redirect and release fallback; retain the downloadable checksum. Test on an actual Android phone and inspect sharing previews. Never interpret a CTA click as successful delivery. Keep release.json aligned with static markup using tools/release.mjs and checks.

## Search Console

Use an owner-controlled Google account. A URL-prefix property **https://al-murajaah.devs.surf/** can use an HTML verification file at its exact supplied path or the exact supplied meta tag in the home page head, if offered. No parent-domain control is needed for those website-based methods. Keep the file/tag after verification.

A Domain property **al-murajaah.devs.surf** requires the relevant DNS verification record and access/cooperation from whoever controls this subdomain's DNS. Do not claim control of devs.surf. Select only a method actually offered for the property and permissions available. If an existing verified parent-property owner can grant appropriate access, coordinate with them. No analytics or Tag Manager needs to be added for verification.

The owner must supply the actual Google verification HTML file contents/name, meta value or DNS record received in Search Console. No placeholder verification token is installed. Verify ownership after production is reachable, submit https://al-murajaah.devs.surf/sitemap.xml, then use URL Inspection for the canonical home page: test the live URL, review rendered content/canonical/indexability and request indexing if eligible. Inspect notices.html as needed. Recheck the indexing report after processing. The sitemap contains only these two real pages; the 404 and download asset are excluded. No invented lastmod dates, ratings or reviews are used.

Indexing, ranking, rich results and processing time are not guaranteed. Keep useful readable HTML and accessible assets. Documentation: [ownership methods](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [URL Inspection](https://support.google.com/webmasters/answer/9012289).

## Required owner decisions and values

- Website repository URL and explicit publication instruction.
- Chosen static host/account/project and permission to deploy and attach this subdomain.
- DNS administrator or delegated DNS access; exact provider-supplied records.
- Search Console property/account and its real verification value/file (after creation).
- Review of desktop/mobile captures and, when hosted, physical-device and sharing acceptance.

## Recovery

Clone the website repository once it exists, restore this source tree and serve dist unchanged; no secret is required to run the site. Sign in anew to the hosting/GitHub/DNS/Search Console owner accounts, using the owner's independent account recovery. Source files cannot recover dashboard-only access. Record host-specific project IDs and DNS instructions privately once known. Preserve the reviewed website source in the private additive backup until a repository and independent encrypted copy are verified. Never deploy the private backup.
