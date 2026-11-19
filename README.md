# Ankit Singh: portfolio

A static portfolio site for GitHub Pages. Plain HTML, CSS and JavaScript in separate files, no build step and no dependencies. It makes no requests to third parties: fonts are self-hosted and there is no analytics.

Live address after deploying: **https://ankit-singh-engineer1.github.io/**

## Deploy (this also fixes the dead link after the username change)

A GitHub Pages *user site* only works when the repository is named exactly `<your current username>.github.io`. The old repository was named for the old username (`ASNR1010.github.io`), so the site stopped resolving.

1. Rename the repository to **`ankit-singh-engineer1.github.io`** (repository **Settings → General → Repository name**).
2. Put the contents of this folder at the root of the repository's `main` branch, then commit and push:
   ```bash
   git clone https://github.com/ankit-singh-engineer1/ankit-singh-engineer1.github.io.git
   cd ankit-singh-engineer1.github.io
   # copy everything from this folder into here (replace the old files), then:
   git add -A
   git commit -m "Rebuild portfolio"
   git push origin main
   ```
3. Open **Settings → Pages**, set **Source** to **Deploy from a branch**, choose **main** and **/(root)**, and save. The site is live after a minute or two.
4. Update the places that still point at the old address: your resume PDF, LinkedIn, the GitHub profile website field, and the website field of each Chrome Web Store listing.

Optional custom domain: add a file named `CNAME` containing the domain, and set the same domain under Settings → Pages.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly also works.

## What is where

```
index.html            all content, in section order: hero, extensions, experience, projects, skills, education, contact
404.html              page shown for missing addresses
css/
  tokens.css          colours, type scale and the six themes (every colour on the site comes from here)
  base.css            reset, typography, layout, focus styles, reduced motion
  components.css      buttons, header, theme menu, tags, toast
  sections.css        layout of each section and the theme picker
  visuals.css         the drawn illustrations in the extension rows
  print.css           print and PDF layout
  fonts.css           @font-face rules
js/
  theme-init.js       runs in <head> and sets the saved theme before first paint
  theme.js            theme picker, keyboard shortcuts, remembered choice
  nav.js              header, mobile menu, current-section highlight
  ui.js               toast messages, copy-to-clipboard, footer year
assets/
  Ankit-Singh-Resume.pdf   the resume the buttons download
  fonts/                   self-hosted fonts and their licence (OFL.txt)
  favicon.svg, apple-touch-icon.png, og-image.png
robots.txt, sitemap.xml, .nojekyll
```

## Common edits

**Change text.** Everything is in `index.html`. Each section has an `id` (`extensions`, `experience`, `projects`, `skills`, `education`, `contact`) so you can find it quickly.

**Remove the "Open to new roles" status.** Delete the `<p class="status">` line in the hero, and reword the first sentence of the paragraph in the `#contact` section.

**Replace the resume.** Overwrite `assets/Ankit-Singh-Resume.pdf` and keep the file name. The PDF is public, so check it for details you do not want shared, such as a phone number.

**Add a Chrome extension.** In the `#extensions` section, copy one `<article class="ext">` block and change the id, name, summary, bullet points, tags and the two links (Chrome Web Store and privacy policy). Update the matching entry in the JSON-LD block near the top of `index.html` too.

**Use real screenshots instead of the drawn scenes.** Save the image in `assets/img/` and replace the `<figure class="ext-visual">…</figure>` contents with:
```html
<img src="assets/img/theme-studio-github.png" alt="The popup with six themes over a GitHub pull request" width="1280" height="800" loading="lazy">
```
Use the real Chrome Web Store icon the same way, inside the `<span class="ext-icon">` next to the extension name:
```html
<span class="ext-icon"><img src="assets/img/theme-studio-github-icon.png" alt="" width="128" height="128"></span>
```

**Add a theme.** No JavaScript change is needed.
1. In `css/tokens.css`, copy one `[data-theme="…"]` block, rename it and change the values.
2. In `index.html`, copy one `.theme-tile` in the hero picker and one `.theme-opt` in the header menu, and use the new name as the radio `value` and as the preview's `data-theme`.

If you change the **Ink** values, update the no-JavaScript dark fallback at the top of `tokens.css` as well.

## Keyboard shortcuts

`Alt+Shift+.` next theme, `Alt+Shift+,` previous theme, `Alt+Shift+T` back to the system theme. They match the Theme Studio extensions.

## Credits and licences

- Type: Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono (Braille Institute), and the digits 0 to 9 from Hanken Grotesk, so numerals have a plain zero. All three are under the SIL Open Font License 1.1, copied in `assets/fonts/OFL.txt`.
- GitHub and Claude are trademarks of their respective owners. The page says plainly that the Theme Studio extensions are independent projects.
