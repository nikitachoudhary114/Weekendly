# Weekendly

A weekend planning app that helps you build a Saturday–Sunday schedule, discover nearby spots, and export a shareable plan — all in the browser.

**Live demo:** [[https://week-endly.vercel.app]](https://week-endly.vercel.app/)

---

## Features

### Interactive weekend planner (`/activity`)

- **Two-day schedule** — Saturday and Sunday, 8:00 AM–11:00 PM
- **16 built-in activities** across outdoor, indoor, food, social, fitness, culture, and relaxation
- **Mood-coded blocks** — adventurous, relaxing, creative, energetic, social
- **Drag-and-drop** — add activities from the library, move events, and drop nearby suggestions onto time slots ([`@dnd-kit`](https://dndkit.com))
- **Tap-to-add on mobile** — select an activity, then tap a slot (with a sticky hint bar)
- **Adjust events** — move with grip/arrow buttons, change duration with +/- or resize handle
- **Conflict prevention** — overlapping slots are blocked
- **Search & filter** — find activities by name or category in the library

### Live weekend insights

- **Your location** — browser geolocation with manual refresh
- **Local weather** — current conditions via [Open-Meteo](https://open-meteo.com/) (no API key)
- **Weather-aware picks** — suggests outdoor or indoor activities based on conditions
- **Google Places nearby** — cafés, restaurants, attractions, parks, and more
  - Tabs: All · Cafés & food · Fun & outings
  - Ratings, addresses, and links to Google Maps
  - Draggable place cards into your schedule

### Plan management

- **Auto-save** — schedule persisted in `localStorage` (Saturday/Sunday keys)
- **Weekend summary** — activity count, total hours, mood breakdown, chronological timeline
- **Export poster** — download the schedule as a PNG
- **Clear all** — reset the weekend plan

### UI & experience

- **Landing page** — hero, feature highlights, testimonials, and call-to-action
- **Light / dark theme** — toggle in the navbar; preference saved locally
- **Mobile layout** — tabbed views for Activities, Schedule, and Summary
- **PWA** — installable, offline-capable static assets via Workbox
- **Animations** — page transitions and micro-interactions with Framer Motion

---

## Tech stack

| Layer | Tools |
|-------|--------|
| Framework | React 19, TypeScript, Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, Radix UI primitives |
| State | [Jotai](https://jotai.org/) (atoms + `localStorage` sync) |
| Drag & drop | `@dnd-kit/core` |
| Maps & places | Google Maps JavaScript API, Places API (New) |
| Weather | Open-Meteo REST API |
| Export | `html-to-image` |
| Deploy | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
git clone https://github.com/nikitachoudhary114/Kairos.git
cd Kairos
npm install
cp .env.example .env.local   # then add your Google API key
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The planner is at `/activity`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Environment variables

Copy `.env.example` to `.env.local` for local development:

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

The `VITE_` prefix is required — Vite inlines this at **build time**.

### Google Cloud setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing on the project
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API (New)** — required for nearby search in production
   - *(Optional)* **Places API** — legacy REST fallback used in local dev via Vite proxy
4. Create an API key under **Credentials**
5. Restrict the key:
   - **Application restrictions:** HTTP referrers  
     `http://localhost:*`  
     `https://your-domain.vercel.app/*`
   - **API restrictions:** Maps JavaScript API + Places API (New)

### Deploying to Vercel

1. Add `VITE_GOOGLE_MAPS_API_KEY` in **Project → Settings → Environment Variables** (Production + Preview)
2. Redeploy — env changes only apply after a new build

Without the key, the planner still works; nearby places and map features are disabled with a clear error message.

---

## Project structure

```
src/
├── components/
│   ├── ActivityPage/     # Planner UI (schedule, library, insights, DnD)
│   ├── LandingPage/      # Marketing sections
│   └── ui/               # Shared primitives (button, card, toast)
├── data/activities.ts    # Curated activity catalog
├── hooks/                # Geolocation, weather, Google Places, planner actions
├── lib/                  # Time utilities, planner logic, Google Maps loader
├── pages/                # Landing + Activity routes
├── store/                # Jotai atoms (theme, schedule, UI state)
└── types/                # Shared TypeScript types
```

---

## How scheduling works

1. Pick an activity from the library (or drag a card / nearby suggestion)
2. Drop it on a time slot, or tap a slot on mobile
3. Events span multiple hours based on activity duration; resize or move as needed
4. The schedule saves automatically to `localStorage`
5. Export a PNG poster or review stats in the Weekend Summary panel

---

## Roadmap

- [ ] User accounts and cross-device sync
- [ ] Real-time collaboration
- [ ] Push notifications / reminders
- [ ] Custom activity creation

---

## License

Private project — see repository owner for usage terms.
