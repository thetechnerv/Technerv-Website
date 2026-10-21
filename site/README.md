# Tech Nerv website

Vite + React + TypeScript, with GSAP ScrollTrigger and Lenis for motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Note: the site uses client-side routing (`/services`, `/work`, `/about`, `/contact`), so the host must serve `index.html` for unknown paths (SPA fallback).

## Structure
- `src/styles/tokens.css`: colour, type, spacing and motion tokens
- `src/data/services.ts`, `src/data/projects.ts`: all service and project copy
- `src/components/`: shared pieces (nav, footer, pixel icon pack, halftone wordmark, signal terrain)
- `src/components/home/`: home page sections, including the agent-run simulation (`AgentRun.tsx`)
- `src/pages/`: one file per route
- `scripts/shot.mjs`: desktop and mobile screenshots of any section, used for the design reviews
- `scripts/check-overflow.mjs`: flags anything wider than a 390px phone screen

## Placeholders to replace before launch
- **Email**: `hello@technerv.com` (Nav, Footer, CtaBand, Contact)
- **Contact form**: set `FORM_ENDPOINT` (and optionally `BOOKING_URL`) in `src/pages/Contact.tsx`. Without an endpoint, the form opens the visitor's email app with the details filled in.
- **Social links**: Footer "Elsewhere" column
- **Projects**: all six in `src/data/projects.ts` are illustrative examples, and their metrics are example figures. Add `youtubeId` per project to enable the video embeds.
- **Testimonials**: `src/pages/Work.tsx`. These are placeholders and are labelled as such on the page.
- **Process timings and FAQ answers**: check that they match how you actually work.
