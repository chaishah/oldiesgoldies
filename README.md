# Retro-Tech Academy

A zero-login, local-first learning app for seniors with a 1950s-1960s TV dashboard style.

## Stack

- Next.js 15 App Router
- Tailwind CSS
- Zustand persist with `localStorage`
- Framer Motion
- Static export for Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
```

The project uses `output: "export"` in `next.config.ts`, so the static site is emitted to `out/`.

## Vercel

Import this repository into Vercel and keep the defaults:

- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `out`

The app does not need environment variables, a database, or authentication.
