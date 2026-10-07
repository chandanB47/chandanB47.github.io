# Chandan B — portfolio (v9, "Raw to refined")

A cinematic data-analyst portfolio. Plain HTML, CSS and JavaScript. No build step, no frameworks, no external requests.

## What's new
- **Live image background.** Your two photos are rendered by a small WebGL engine:
  - *Gold rock:* depth parallax that follows the cursor, heat shimmer, breathing light rings, and an intro where the scene starts dim and glitchy (a chromatic split) and resolves as the headline "cleans up".
  - *Mossy arch:* foliage sway, drifting mist, parallax. It fades in on the Tools, Experience and Education sections and back to gold for Contact.
- **Ember particles** that orbit the rock's light rings. They scatter and then organize into the rings during the intro, they push away from the cursor, and clicking the page fires a burst of sparks.
- **Headline:** the letters of "messy data" scatter and snap into place. Hover it to replay the clean-up.
- **Results ledger** with count-up numbers, a typed SQL console, **expanding project rows** with technique snippets, and a **scroll-driven workbench** that shows how a messy table becomes a finding.
- Glass surfaces with a pointer spotlight, a glass navigation pill, and an accent that shifts from gold to moss with the scene.
- Fonts are self-hosted (Bricolage Grotesque, Newsreader, JetBrains Mono, all SIL OFL). Licenses are in `assets/fonts/`.

## Deploy (GitHub Pages)
1. Open the repo `chandanB47/chandanB47.github.io`.
2. Delete the old files and upload everything from this folder: `index.html`, `style.css`, `script.js`, `resume.pdf`, `README.md`, and the `assets/` folder.
3. Commit. The site is live at https://chandanB47.github.io within a minute or two.

## Run locally
Serve the folder over HTTP so the WebGL stage can load the photos:

    python -m http.server 8000      # then open http://localhost:8000

Opening `index.html` by double-click still works, but browsers block WebGL textures on `file://`, so you get the CSS fallback: the same photos with parallax and particles, minus the shader effects.

## Change the background images
Replace `assets/bg/hero-gold.webp` and `assets/bg/section-moss.webp` (any 16:9-ish image, about 1600 px wide, under about 300 KB as WebP), then tune the framing at the top of `script.js`:

    const BG = {
      gold: { focus:{x,y}, target:{desktop:{x,y}, mobile:{x,y}}, rings:[...] },
      moss: { ... }
    }

`focus` is the point of the photo that must stay visible (0 to 1). `target` is where on screen it lands. `rings` are the light-ring ellipses the embers follow (used for the gold image only).

To add a third scene, extend the shader in `script.js` and give any section `data-bg="yourscene"`.

## Things to finish
- **Case study links.** The E-commerce, Spotify and Sales dashboard projects say "coming soon". Add repository links when they're ready.
- **Check the repo links** for Retail Operations, Data-Science-Learning and vehicle-rental-system.
- **The SQL snippets** in project rows are labelled illustrative. Replace them with real queries from your repos when you can.
- Your phone number is on the résumé PDF only and is not published in the page text.

## Accessibility and performance
- Reduced-motion users get a still, fully readable page. No WebGL means the CSS fallback.
- The WebGL stage lowers its resolution automatically on slower GPUs and pauses when the tab is hidden.
- Skip link, visible focus states, keyboard-operable project rows, and a live region for the copy-email message.
