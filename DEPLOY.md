# AI Product Critic — Deployment

## Local dev
```
npm install
npm run dev
```

## GitHub Pages

1. Push this repo to GitHub
2. In `package.json`, update the `homepage` field if needed:
   ```json
   "homepage": "https://<username>.github.io/<repo-name>"
   ```
3. Deploy:
   ```
   npm run deploy
   ```
   This runs `npm run build` then `gh-pages -d dist`.

4. In GitHub repo Settings → Pages → set Source to `gh-pages` branch.

### SPA fallback on GitHub Pages
GitHub Pages doesn't support SPA routing natively.  
Since this app uses no router (single-page state machine), no 404 fallback is needed.  
If you add routing later, copy `dist/index.html` to `dist/404.html` in the build step.

## Environment notes
- No backend, no API keys, no auth — fully static
- Tesseract.js downloads language data (~2 MB) from jsDelivr CDN on first analysis
- All analysis runs in-browser (Web Workers)
- WebGL heatmap rendering, falls back to Canvas 2D automatically
