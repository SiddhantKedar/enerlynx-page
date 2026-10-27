# enerlynx-web

Marketing site for enerlynx.in. Single page, light theme.

**Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · lucide-react · Motion

## Setup on a new machine

1. Install **Node.js 22 LTS** (or 20.9+) from https://nodejs.org. Check with `node -v`.
2. From this folder:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000. Edits reload instantly.

Fonts are self-hosted from npm (`@fontsource-variable/*`), so nothing is fetched from Google at build time.

## Build for hosting

```bash
npm run build
```

Writes a fully static site to `./out`. Upload that folder to any static host (S3 + CloudFront, Nginx, Netlify, Vercel, cPanel).

## Adding shadcn components

`components.json` is already configured, so on a machine with normal internet:

```bash
npx shadcn@latest add accordion tabs
```

Components land in `src/components/ui/` and pick up the brand tokens automatically.

## Where things live

| Path | What |
|---|---|
| `src/app/globals.css` | Design tokens: brand colours, surfaces, radii, fonts |
| `src/lib/site.ts` | Nav items, emails, portal URL, SEO copy. Edit content here |
| `src/components/brand/logo.tsx` | Logo mark + wordmark (`tone="light" \| "dark"`) |
| `src/components/layout/` | Header, footer, `Container` |
| `src/components/ui/` | shadcn primitives (button, sheet) |
| `src/components/sections/` | Page sections (added one at a time) |
| `src/app/page.tsx` | Assembles the sections in order |

## Brand tokens

| Token | Hex | Use |
|---|---|---|
| `orange` / `primary` | `#e17100` | Primary actions, active states |
| `olive` | `#497d00` | Secondary accent, "live/ok" status |
| `ink` | `#1b1a16` | Headings, footer, logo stroke |
| `background` | `#f5f5f3` | Page paper |
| `card` | `#ffffff` | Raised surfaces |
