# Digital Griot Studio — social signup tracker

Live tracker for the @digitalgriotstudio namespace claim. Reads from `data/socials.json` and renders a modern grid of platform cards with status, signup URLs, and setup notes.

## URL

This is a project page — once GitHub Pages is enabled, the tracker lives at:

`https://thedigitalgriot.github.io/digital-griot-social/`

## How to update progress

Every platform is one entry in `data/socials.json`. To mark a platform as claimed, change the `status` field on its entry:

```json
{
  "id": "instagram",
  "status": "claimed",
  "claimed_date": "2026-05-27"
}
```

### Status values

| Value | Meaning |
|-------|---------|
| `pending` | Not yet claimed |
| `claimed` | Fresh account created, handle locked |
| `renamed` | Existing @thedigitalgriot account renamed to @digitalgriotstudio |
| `blocked` | Cannot claim (handle taken, platform restricted, anti-bot) |
| `skipped` | Intentionally not claiming this platform |

### Setup type values

| Value | Meaning |
|-------|---------|
| `fresh` | New account from scratch |
| `rename` | Rename existing @thedigitalgriot account |
| `either` | Either path works — audit your existing presence |
| `org` | Create a new org under your existing account (GitHub, npm) |

## Deploy

GitHub Pages auto-serves from main branch root once enabled. Enable in repo Settings → Pages → Source = `main` / `/ (root)`.

For **private repos**, GitHub Pages requires a paid plan (Pro and up). For free-plan access, make the repo public — the tracker data is non-sensitive (public handle status).

## Local preview

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Files

- `index.html` — single-page app shell
- `styles.css` — modern flat design, dark/light auto-switch
- `app.js` — fetch JSON, render, filter
- `data/socials.json` — the data, edit this to update progress
- `.nojekyll` — disables Jekyll so files in `data/` are served
