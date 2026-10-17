# Pat's Handyman LLC — website

Static remake of patshandymanllc.info. Free hosting on GitHub Pages.

## Go-live checklist

1. **Repo**: push this `site/` folder's contents to the `main` branch of Pat's repo.
2. **Pages**: repo Settings → Pages → Deploy from branch → `main`, folder `/ (root)`.
   (This folder IS the site root — push its contents, not the folder itself.)
3. **Domain**: GoDaddy DNS for patshandymanllc.info:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - or `CNAME` `www` → `<username>.github.io`
   - The `CNAME` file in this folder tells Pages the custom domain. Enforce HTTPS in Pages settings once DNS resolves.
4. **Quote form**: get a free key at https://web3forms.com (sent to patshandymanllc@gmail.com),
   paste it into `index.html` replacing `YOUR_ACCESS_KEY_HERE`. Free: 250 submissions/mo.
5. **Admin editing** (`/admin`, Decap CMS): set `repo:` in `admin/config.yml`, then deploy the
   free decap OAuth bridge (Cloudflare Worker) and set `base_url:`. Pat logs in with GitHub
   and edits services, hours, phone, etc. — no code needed.
6. **Cancel B12** only after the new site is live on the domain and tested.

## Preview locally

```sh
cd site && python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html` — the whole one-page site
- `styles.css`, `site.js` — styling + behavior
- `assets/` — logo concepts (`logo-*.png`), photos (`hero.jpg`, `about.jpg`)
- `content/settings.json`, `content/services.json` — Pat-editable content (also via /admin)
- `admin/` — Decap CMS
- `CNAME` — custom domain for GitHub Pages
