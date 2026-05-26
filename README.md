# QAYTA

Kazakhstan's circular-economy food-waste platform — **React + Vite + Convex + Clerk**.

## Stack

- **Frontend:** React 18, Vite, TypeScript (strict), React Router v6
- **Backend:** Convex (realtime DB, functions, crons, webhooks)
- **Auth:** Clerk (`@clerk/clerk-react`)
- **i18n:** react-i18next (RU / KK)
- **Maps:** Mapbox GL JS (lazy loaded)
- **Charts:** Chart.js (partner analytics)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local

# 3. Terminal A — Convex backend
npx convex dev

# 4. Terminal B — Vite frontend
npm run dev

# 5. (Optional) Seed demo data
npm run convex:seed
```

## Environment variables

### Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | From `npx convex dev` output |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dashboard |
| `VITE_MAPBOX_TOKEN` | Mapbox public token |

### Convex (`npx convex env set`)

- `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_FARM_*`
- `KASPI_*`, `RESEND_API_KEY`, `RESEND_FROM`

## Routes

| Role | Paths |
|------|-------|
| Consumer | `/`, `/rescue`, `/rescue/:boxId`, `/orders`, `/profile`, `/leaderboard` |
| Partner | `/partner/dashboard`, `/partner/boxes`, `/partner/boxes/new`, … |
| Farmer | `/farmer/dashboard`, `/farmer/explore`, … |
| Bio | `/bio`, `/bio/:productId`, `/bio/my-units` |
| Admin | `/admin`, `/admin/partners`, … |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/onboarding` |

## Project structure

```
convex/          Backend schema, queries, mutations, crons, seeds
src/
  layouts/       Role-based layouts (Consumer, Partner, …)
  pages/         Pages by role
  components/    Shared UI (SurpriseBoxCard, ImpactTicker, …)
  lib/           Convex client, role guards
  i18n/          RU/KK translations
index.html
vite.config.ts
docker-compose.yml   Redis Stack (local dev)
```

## Design system

CSS variables in `src/index.css` — earth/clay/cream palette, DM Serif Display + IBM Plex Sans/Mono. No gradients, shadows, or glass effects.

## Notes

- Run `npx convex dev` once to regenerate `convex/_generated/` with full types (stub exists for offline TS).
- Partner/farmer accounts require admin verification before publishing boxes.
- Kaspi Pay and Stripe webhook handlers in `convex/http.ts` are scaffolded; wire credentials for production.
