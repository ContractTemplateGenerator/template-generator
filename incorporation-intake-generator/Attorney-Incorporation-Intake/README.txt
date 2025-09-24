# Terms.law — Attorney-Led Incorporation Intake (No-build version)

This folder contains a **single-file React app** (`index.html`) you can drop into your GitHub repo and iframe from WordPress. No Node.js build is required.

## Local preview (on your Mac)

1. Double–click `index.html` — it will open in your browser and work offline.
2. Or serve it locally:
   ```bash
   cd "Attorney-Incorporation-Intake"
   python3 -m http.server 5173
   ```
   Then open http://localhost:5173

## Embed in WordPress/Elementor

1. Upload this folder to your GitHub repo that backs `https://template.terms.law/` as `Attorney-Incorporation-Intake/` so the file is available at:
   - `https://template.terms.law/Attorney-Incorporation-Intake/index.html`

2. In your Elementor tab, paste the following HTML (adjust the `src` if you use a different path):

   ```html
   <script src="https://template.terms.law/Attorney-Incorporation-Intake/embed-resizer.js"></script>
   <iframe
     data-termslaw-embed
     src="https://template.terms.law/Attorney-Incorporation-Intake/index.html"
     style="width:100%;min-height:900px;border:0;"
     title="Attorney-Led Incorporation Intake">
   </iframe>
   ```

The `embed-resizer.js` listens for height messages from the iframe and expands it to fit the full intake UI.
