# Ulvi — Hybrid Athlete Dashboard

Personal hybrid athlete tracking system built for Ulvi. Inspired by Arda Saatci (Red Bull Cyborg).

**Stack:** Next.js 14 · TypeScript · Firebase · Tailwind CSS · Recharts · Lucide

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Today's workout, quick stats, marathon achievement |
| `/workout` | Workout Tracker | 7-day program with set logging & rest timers |
| `/pullups` | Pull Up Tracker | Set logger, volume charts, 6-month progression |
| `/nutrition` | Nutrition | Macro rings, food database, water & supplement tracker |
| `/progress` | Progress | Body metrics charts, 6-month goal tracker |
| `/running` | Running Log | Run history, pace progression, monthly volume |
| `/settings` | Settings | Profile, nutrition targets, data export |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase — add your credentials to .env.local
# (already configured with workout-buddy-a5d78 project)

# 3. Run locally
npm run dev

# 4. Open http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel --prod
```

Add all `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel project settings.

## Athlete Profile

- **Name:** Ulvi · iOS Developer @ Kapital Bank, Baku
- **First Marathon:** Baku 2026 · 43.08km · 6:39:03 · 9:06/km
- **Goals:** 20+ pull ups, sub-7:00/km pace, RHR 50-54, HRV 70-80ms
- **Posture focus:** Pelvic tilt + lumbar lordosis (hip flexor stretch every session)
