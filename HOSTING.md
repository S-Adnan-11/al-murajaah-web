# Hosting and search maintenance

The live website is **https://al-murajaah.devs.surf/**. Source: [S-Adnan-11/al-murajaah-web](https://github.com/S-Adnan-11/al-murajaah-web). The **Deploy website** GitHub Actions workflow uploads the static website to the existing Cloudflare Pages project only when manually dispatched.

## Deployment

| Setting | Value |
| --- | --- |
| Existing Pages project | `al-murajaah-web` |
| Production branch | `main` |
| Framework preset | None |
| Build command | Empty |
| Root directory | Repository root |
| Output directory | `dist` |
| Runtime secrets or environment variables | None |
| Deployment trigger | GitHub Actions `workflow_dispatch` only |
| GitHub environment | `production`, URL `https://al-murajaah.devs.surf/` |
| Cloudflare automatic production deployments | Disabled |
| Cloudflare automatic preview deployments | None |

Source documentation, tools and README screenshots stay outside the served directory. No Node process runs in production. Keep the existing Pages project, Git connection and custom domain, with Cloudflare's automatic deployments disabled. Uploading with Wrangler works with an existing Git-integrated Pages project; do not create a replacement project or migrate it to Workers. To use another static host, publish `dist/` and preserve HTTPS, MIME types and genuine HTTP404 responses. Do not add a catch-all rewrite to the homepage.

### One-time dashboard setup

1. In [Cloudflare](https://dash.cloudflare.com/), open **Workers & Pages → al-murajaah-web**. Check **Custom domains** includes the active `al-murajaah.devs.surf` domain. Keep its DNS and domain mapping intact.
2. Open **Settings → Builds & deployments → Configure Production deployments** (some dashboard versions group these under **Build → Branch control**). Keep the production branch `main`, uncheck **Enable automatic production branch deployments**, and save.
3. In the preview branch controls, choose **None** and save. Reopen both controls and verify production automation is unchecked and preview automation is **None**. Keep these disabled before normal pushes. These controls affect automatic builds; they do not remove the current live deployment. See [Cloudflare branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/). The initial workflow setup commit starts with `[CF-Pages-Skip]`, Cloudflare's documented [skip-deployment prefix](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message), so that setup push omits its Git-integration deployment even if dashboard setup is pending. This prefix does not prevent a manually dispatched Actions upload.
4. Check the existing build settings: no framework, empty build command, repository root, output `dist`. The tracked `dist/index.html`, `dist/app.js` and assets are the ready-to-upload website; there is no build or dependency-install step for the website.
5. In this website repository, open **Settings → Environments → New environment**, name it exactly `production`, and configure **Deployment branches and tags → Selected branches and tags → Add deployment branch or tag rule → Branch → main**. Reuse the environment if it already exists. The workflow supplies the production URL. Creating this environment does not deploy anything.

### Cloudflare credentials (GitHub secrets only)

Create a custom API token in the Cloudflare dashboard's **API Tokens → Create Token → Custom token → Get started**. A profile token can be created from **My Profile → API Tokens**. Set its permission to **Account → Cloudflare Pages → Edit** and scope **Account Resources → Include → Specific account** to the account that owns `al-murajaah-web`. Give it a descriptive name and an appropriate expiry, then create it. Use this scoped token, not the Global API Key. The Pages permission covers the read-only project preflight and asset deployment; no DNS edit permission is needed. See [Cloudflare's CI credential instructions](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

Find that same account's **Account ID** in the Cloudflare account dashboard (account menu **Copy account ID**, or the API section of a domain's Overview). Use the Pages-owning account ID, not a Zone ID. You do not need to add a domain or change nameservers to obtain it.

In [repository environments](https://github.com/S-Adnan-11/al-murajaah-web/settings/environments), open `production`, then **Environment secrets → Add environment secret** for each exact name:

| Secret name | Value to enter privately in GitHub |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The custom Cloudflare API token above. |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID of the existing Pages project. |

Never paste either value into source, commits, issues, logs or chat. No manually configured GitHub token is needed. No credential belongs in `dist/`, and visitors receive no secrets. Rotate the API token by replacing the environment secret when it expires or is revoked.

### Manually deploy and verify history

1. Review the desired commit on `main`, then open [Actions → Deploy website](https://github.com/S-Adnan-11/al-murajaah-web/actions/workflows/deploy.yml). Select **Run workflow → Use workflow from: main → Run workflow**. Pushes, pull requests and schedules never run this workflow. Selecting another branch skips the deployment job. Queued production runs do not cancel an active upload.
2. Open the run and note its commit SHA. Checkout uses that exact dispatched SHA, even if `main` moves while the job waits. The workflow runs `node tools/check.mjs` and `node --check dist/app.js`, confirms the checked-out SHA, and checks the existing Pages project's production branch, domain and disabled automatic production/preview settings before uploading `dist/`. Wrangler receives the same SHA through `--commit-hash` and the production branch through `--branch=main`.
3. Wait for **Deploy to production** and the workflow to finish successfully. In the repository's **Deployments** view (or **Environments → production → View deployments**), open the new `production` entry. Check its commit matches the run SHA, its status reflects the deployment job's result, its log link opens that run, and **View deployment** opens `https://al-murajaah.devs.surf/`. A failed job must show failure, not a synthetic success. See [GitHub environment deployment records](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments#how-environments-relate-to-deployments).
4. GitHub creates the deployment and status history for the one job referencing `production`. The workflow uses Wrangler directly and never calls the GitHub Deployments API or passes a GitHub token to a deployment action, avoiding duplicate records. Creating the environment or committing this workflow creates no deployment history; only an actual run does. Retrying a deployment is another real attempt. Old Cloudflare Git-integration builds are not backfilled into GitHub history. A failed preflight can have a failed GitHub deployment record even though it uploaded nothing; inspect the job log to see which step failed.
5. In Cloudflare's existing project's **Deployments** tab, verify the new successful **Production** deployment reports branch `main` and the same commit SHA. Open its unique deployment URL and the custom domain. Hard-refresh the live homepage and `/notices`; verify CSS, images, font, theme controls and the direct Android download link. Fetch `/robots.txt`, `/sitemap.xml` and `/assets/icon-192.png`; check their actual content types and a missing route's HTTP404. Compare the live HTML and asset responses with this commit's `dist/` files and the unique deployment URL. If the website content was unchanged, its appearance should remain unchanged; the matching SHA and successful upload are the deployment evidence. Follow the production checks below for the full response checks.

Do not click **Run workflow** during setup. The first manually requested run creates the first genuine GitHub deployment attempt. Dashboard automation settings are external state, so verify them yourself; the workflow's read-only preflight also refuses to upload if they are enabled.

Cloudflare Pages redirects `/index.html` and `/index` to `/`, and `/notices.html` to `/notices`. The notices canonical and sitemap use the final extensionless URL. The provider hostname serves the same HTML with the production canonical and site name; it is absent from the sitemap. Query-string homepage variants also declare the production root canonical. Do not point canonical, Open Graph, sharing-image or WebSite URLs at a provider hostname or local preview.

When attaching a different custom domain, register it with the host first, then use that project’s actual provider-supplied DNS target. Do not change the parent domain’s nameservers to configure a subdomain. See [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/). Account recovery, credentials and deployment evidence belong outside the public repository.

## Production checks

- Fetch the homepage as meaningful initial HTML with HTTP200. Preserve existing Search Console verification files/tags and DNS ownership records; no verification token is generated by this project.
- Check HTTP-to-HTTPS redirects, homepage variants, production canonicals, page titles and a single authoritative WebSite JSON-LD node. Preserve truthful SoftwareApplication data. Validate site-name markup with [Schema Markup Validator](https://validator.schema.org/); Google’s Rich Results Test does not support the site-name feature.
- Keep the stable `/assets/icon-192.png` PNG declared in initial HTML, alongside the smaller browser icon and Apple touch icon. Icons, sharing images, screenshots and bundled font must return200 with their real MIME types and no authentication, challenge or HTML fallback.
- Serve `/robots.txt` as plain text, allowing public pages and pointing to `https://al-murajaah.devs.surf/sitemap.xml`. Serve the sitemap as XML with only canonical, indexable pages: `/` and `/notices`. Do not list downloads, provider URLs, private files or missing pages.
- Test a missing route and missing asset: both must return404. Check that indexable pages have no robots `noindex` directive or `X-Robots-Tag: noindex` header.
- Keep the direct APK anchor and release fallback working. A successful HEAD redirect does not prove that a visitor’s download finished. Check real sharing previews and physical devices separately from emulation.

If one tool receives403/error1010 while browsers or other clients return200, record the UTC time, URL, user agent and Cloudflare Ray ID. [Error1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/) concerns the request’s browser signature. Compare client environments and use the owner’s Search Console live test before concluding that Google is blocked. A spoofed Googlebot user agent is not verified Googlebot. Review the matching security event or ask the responsible zone administrator; do not broadly disable security or add crawl blocks.

## Search Console: test without submitting

1. Open the existing property in [Search Console](https://search.google.com/search-console/). Enter `https://al-murajaah.devs.surf/` in the URL Inspection bar.
2. Select **Test live URL**, wait for completion, and expand **Page availability**. Check **Crawl allowed? Yes**, **Page fetch: Successful** and **Indexing allowed? Yes**, plus any reported robots, HTTP, security or resource errors. A property being added alone does not prove ownership verification or crawl access.
3. Select **View tested page → HTML**. Find one WebSite node named **Al-Murāja’ah**, the production homepage URL and alternate names. Check the preferred name in the title and og:site_name, one production canonical, the 192px icon link, readable initial content and the original English/Arabic reminder. Confirm that the returned document is the website, not a Cloudflare error or challenge page.
4. Review **Screenshot** and **More info** for loaded/blocked resources and HTTP details. The font, CSS, images and script should load. Repeat the live test for `https://al-murajaah.devs.surf/notices`. Check Search Console’s robots.txt report for fetch status if available. Open the robots, sitemap and icon URLs directly as an additional access check.
5. Keep the existing verification method intact. A live test does not determine Google’s selected canonical; that field belongs to the indexed-URL report. Check it there after Google has processed the page.

These instructions do not submit a sitemap or request indexing. When doing that separately, the sitemap address is `https://al-murajaah.devs.surf/sitemap.xml`. A sitemap aids discovery; it is not the switch that starts crawling. Site names, favicon appearance, indexing and ranking remain Google’s decisions and are not guaranteed.

References: [site names](https://developers.google.com/search/docs/appearance/site-names), [favicons](https://developers.google.com/search/docs/appearance/favicon-in-search), [URL Inspection](https://support.google.com/webmasters/answer/9012289).
