# Bosung Hwang — Portfolio

An interactive 3D portfolio built with Three.js, GSAP and Vite.

Live at https://bosungh-portfolio.vercel.app

## Run locally

```sh
npm install
npm run dev       # start the dev server
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Where things live

- `index.html`: the page sections (About Me, My Works, Experience, Contact)
- `data/projectDetails.js`: the content of each project/experience details panel
- `Experience/`: the Three.js scene
  - `Preloader.js`: the intro animation
  - `World/Controls.js`: scroll-driven animations
- `utils/`: the sliding details panel and the image hover overlays
- `public/`: static assets (images, videos, the room model, the Draco decoder, the font)

## Adding a project or experience

1. Add an entry to `data/projectDetails.js`.
2. In `index.html`, add a `section-image-wrapper` block whose `data-project-id` and
   `onclick="window.openDetailsPanel('<id>', event)"` use the same key.
3. Put its images and videos in `public/images/`.

## Deploy

Deployed on Vercel, which builds from source.
