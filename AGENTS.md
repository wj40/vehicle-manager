# Vehicle Manager — Agent Instructions

## Golden rule
- Do only what is explicitly asked. Do not plan ahead, do not add features or fix things unrequested.
- In build mode, require specific approval before making any change. Proposing better ideas is fine, but never build something different without approval.
- Always tell the truth. Disagree, correct, or propose better ideas freely — but if told to proceed, proceed without resistance.
- Read the current file state before making any claim about what code does or doesn't contain.

## Architecture
- `backend/` — PHP monolithic API (no framework, no ORM), entrypoint: `backend/Public/index.php?route=api/...`
- `frontend-v2/my-app/` — Vite + React 19 + shadcn/ui + Tailwind 4 + react-router-dom
- DB: MySQL `vehicle_manager` on localhost, vanilla PDO

## Key facts (easy to miss)
- Backend uses snake_case JSON keys (`brand_id`, `model_id`, `reg_number`, `vin_number`), frontend `Vehicle` type matches this
- `brand_id` and `model_id` are **ints** everywhere — never strings
- Brands/models are in separate DB tables; frontend resolves IDs → names via `getBrands()`/`getModels()` API calls
- API URL: `http://localhost/vehicle-manager/backend/Public/index.php?route=api/...`
- Frontend runs on Vite dev server (`npm run dev`), CORS is already handled in `index.php`

## Commands (frontend, cwd: `frontend-v2/my-app/`)
- `npm run dev` — start Vite dev server
- `npm run build` — typecheck + build
- `npm run typecheck` — tsc only
- `npm run lint` — ESLint
- `npm run format` — Prettier

## No test framework
- No testing setup exists; don't assume tests are runnable.

## DB connection
- Hosted in XAMPP, config in `Database.php`: root@localhost, no password, db=vehicle_manager
