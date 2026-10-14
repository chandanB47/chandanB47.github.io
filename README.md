# Chandan B — Personal Portfolio

<p align="center">
  <strong>Data Analytics · Business Intelligence · Continuous Learning</strong>
</p>

<p align="center">
  <a href="https://chandanB47.github.io/">Live Portfolio</a> ·
  <a href="https://github.com/chandanB47">GitHub Profile</a> ·
  <a href="https://www.linkedin.com/in/chandan47">LinkedIn</a>
</p>

---

## Overview

Welcome to my personal portfolio website. I use this space to present my data analytics learning journey, technical skills, projects, and experience in one place.

My current toolkit includes **SQL, Python, Power BI, and Excel**, with a focus on preparing data, exploring business questions, building dashboards, and communicating useful insights.

🌐 **Live website:** [chandanB47.github.io](https://chandanB47.github.io/)

## Portfolio Sections

| Section | What you'll find |
|---|---|
| **Hero** | Portfolio introduction and primary navigation |
| **About Me** | Background, interests, and learning goals |
| **Skills & Toolkit** | Technologies and tools I am developing |
| **Projects** | Practical work and portfolio projects |
| **Journey & Process** | My approach to learning and problem-solving |
| **Experience** | Relevant experience and development |
| **Contact** | Ways to connect with me |

## Tech Stack

- **SQL** — querying, joins, aggregations, data cleaning, and business analysis
- **Python** — programming and data-focused practice projects
- **Power BI** — data modeling, DAX, Power Query, and dashboard development
- **Excel** — data preparation, analysis, and reporting
- **Web technologies** — HTML, CSS, and JavaScript for the portfolio interface
- **GitHub Pages** — hosting the static website

## Website Features

- Responsive layout for desktop and mobile screens
- Animated hero and atmospheric visual effects
- Glass-style navigation and interface elements
- Interactive project cards and hover effects
- Interactive skills and toolkit cards
- Tool detail interactions on hover and click/tap
- Scroll-triggered reveal effects using `IntersectionObserver`
- Reduced-motion support for accessibility
- Résumé link and contact links

## Featured Work

Explore the [Projects section on my live portfolio](https://chandanB47.github.io/) for my current work.

One documented project is **Retail Store Operations & Analytics**, which uses SQL to explore retail operations and answer business questions.

- [Browse my GitHub repositories](https://github.com/chandanB47?tab=repositories)
- [Open the Retail Operations SQL project folder](https://github.com/chandanB47/Data-Science-Learning/tree/main/SQL/Milestone_Project_01_Retail_Operations)

Project links may change as I refine and publish my work.

## Run Locally

This is a static website and can be run with Python's built-in HTTP server.

1. Clone or download this repository.
2. Open a terminal in the project root (the folder containing `index.html`).
3. Run:

   ```bash
   python -m http.server 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `index.html` directly, although using a local server is preferable for testing.

## Deployment with GitHub Pages

The site is published through GitHub Pages.

1. Keep `index.html` in the repository root.
2. Commit and push the website files to the repository's publishing branch.
3. In GitHub, open **Settings → Pages** and confirm the publishing source.
4. Wait for the Pages deployment to finish, then verify the live website.

Repository: [chandanB47/chandanB47.github.io](https://github.com/chandanB47/chandanB47.github.io)  
Live site: [https://chandanB47.github.io/](https://chandanB47.github.io/)



---

<p align="center">
  <em>Learning continuously. Building practically. Improving with every iteration.</em>
</p>

## Hero image update

The hero uses the included high-resolution `assets/hero-bg.jpg` (1920×1072) and `assets/hero-bg-mobile.jpg` for smaller screens. The title, navigation, SQL pill, and buttons remain real HTML elements for responsive layout, accessibility, and working links. Only hero layout/styling was adjusted; the About, Skills, Work, Experience, Journey, Stats, and Contact sections were left intact.


### Hero image quality and spacing update
- The hero now loads a high-quality WebP rendition of the original 2048 × 1143 ribbon artwork, with JPEG fallbacks.
- The heading is slightly narrower, with a clearer gap before the lime `B`.
- Heavy blur on the hero artwork entrance was removed; the slow motion is restrained to preserve sharpness.
- Other portfolio sections and their content were not edited as part of this update.


## Hero artwork quality

- `assets/hero-bg.webp` is the optimized desktop hero artwork used by the live page.
- `assets/hero-bg-16k.webp` is a 15,360-pixel-wide archival master for future edits and high-resolution exports.
- `assets/hero-bg-mobile.webp` is the responsive mobile artwork.
- `assets/hero-bg-mobile-8k.webp` is the high-resolution mobile master.
- `assets/paint-tear.svg` adds the neon-lime, black, and white paint-drip transition at the bottom of the hero.
- The original content sections and interactions are preserved; the hero controls remain real HTML links, not flattened into a screenshot.

Note: the 16K files are high-resolution upscales of the supplied artwork, not newly captured 16K source detail. The site loads optimized assets for performance.


## Hero update (v10)

- The hero background (`assets/hero-bg*.webp/.jpg`) is now built from the reference cover artwork, with the nav, name, command pill, buttons and scroll hint removed so they remain real HTML.
- The name is set in Inter Black; the dark glass nav, lime active pill, and the neon paint-drip edge now match the reference.
- Previous artwork and the old 16K/8K masters are in `assets/archive/`.
