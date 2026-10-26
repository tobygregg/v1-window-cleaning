# V1 Window Cleaning — website

Single-page static site: plain HTML, Tailwind CSS v3 (compiled and committed) and vanilla JS. No frameworks, no CDNs.

## Folder layout
```
index.html              single page, sections separated by comment banners
thanks.html             form thank-you page (noindex)
404.html                on-brand 404 (GitHub Pages serves it automatically)
assets/css/styles.css   compiled Tailwind (committed)
assets/js/main.js       menu, header, scroll reveal, counters, services explorer, before/after, lightbox, FAQ, form
assets/fonts/           self-hosted woff2 + OFL licences
images/brand/           logo + mark as SVG (traced; -light = for dark backgrounds, -h = horizontal)
images/work/            photos: NNN.webp (~1600px) + NNN-sm.webp (~720px), named after the pack's img-NNN
images/                 favicons, og-image.jpg, site.webmanifest
src/input.css           Tailwind source + @font-face + custom CSS / keyframes
tailwind.config.js      brand colours + fonts
_fb-pack/               raw Facebook pack (not published — underscore folder is ignored by Jekyll)
```

## Brand
| Name | Hex | Used for |
|---|---|---|
| ink | #0b1630 | Dark navy (darkened from logo grey-navy #353a4c) — hero, dark sections |
| brand | #1569fb | Logo blue — links, buttons, accents |
| aqua | #2dd4f0 / #7be3f7 | Highlight in the logo drop — gradients, sparkles |
| foam | #f4f8fe | Light section background |
| sand | #f3ede4 | Warm section (logo background #d6c9b9 family) |
| squeegee | #d7222d | Red from the van cover photo — main CTA |

Fonts: Bricolage Grotesque (display) + DM Sans (body), both OFL. The supplied logo was a 960px photo of a 3D sign, so it was **rebuilt as clean SVG** (lettering outlined from Bricolage Grotesque Bold Italic-style skew, water-drop ring emblem). It is faithful in layout and colour but not pixel-identical — ask the client for the original artwork if they have it.

## Editing
- **Text**: edit `index.html`. Colours: `tailwind.config.js`, then `npm install && npm run build`.
- **Add a work photo**: export `NNN.webp` (~1600px) and `NNN-sm.webp` (~720px) into `images/work/`.
- **Before/after**: each `<button class="thumb">` in `#ba-thumbs` is one pair — `data-before` / `data-after` are file numbers, `data-w`/`data-h` the image size, `data-cat` is `soft|pvc|gut|pat` (filter chips), plus `data-title` and `data-cap`. Add/remove buttons to change the set.
- **Services explorer**: a `.svc-tab` button + matching `.svc-panel` article per service.
- **Gallery**: `.gal-item` buttons (`data-full` = big photo, `data-cap` = lightbox caption; add class `wide` for a double-width tile).
- **Reviews**: `.rcard` figures inside `.rev-track` (the second half is an aria-hidden duplicate for the endless scroll — edit both).

## Before going live — checklist
- [ ] Swap the GitHub Pages URL for the real domain: canonical, og tags, JSON-LD, sitemap.xml, robots.txt, form `_next`.
- [ ] **If the client goes ahead: change the form action from Toby's email (`formsubmit.co/toby1@greggs.org`) to the client's and activate FormSubmit.**
- [ ] Confirm phone 07781 425697 and email jasonhooper8@hotmail.com. (The van also shows 07781 116402 — not used because it isn't in the page text; ask which to show.)
- [ ] Client to sign off services wording.
- [ ] The Facebook bio is cut off at "…the more advanced Wate…". I assumed **water-fed pole**; please confirm.
- [ ] Street address (house name in Vale, GY3 5PE) deliberately not published — only "Vale, Guernsey". Confirm if they want it shown.
- [ ] Team names on the site are only Jason and Tony (named in reviews). Confirm anything further.
- [ ] Before/after captions are factual descriptions; the client may want to refine them. Check each pair really is before→after in the right order.
- [ ] Not used: posts with video only, celebrity-look-alike post (img-027), "clowns" / festive / Halloween joke posts, the 2024 year-end night out is used once as the team photo.

## Source
Built from the Facebook pack in `_fb-pack/` (not published on the live site).
