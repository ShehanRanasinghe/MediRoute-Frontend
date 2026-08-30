# MediRoute Frontend

Next.js frontend for **MediRoute** — the dispatcher-facing console for the
Intelligent Decision Support System built for the PDSA coursework. Talks
to the [MediRoute Backend](https://github.com/ShehanRanasinghe/MediRoute-Backend) over REST, **and**
directly to Supabase for admin-only features (see "Admin Panel" below).

The app has three layers: a public **Dispatch Console** (report an
incident, watch all five algorithms run automatically), a public
**Algorithm Explorer** (run each algorithm on its own, for testing and
demonstrating individual components), and a login-gated **Admin Panel**
(system management: reset demo data, verify reported incidents, add
ambulances/resources/supplies/locations).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Material UI (MUI) v9 |
| Language | TypeScript |
| Data fetching | native `fetch` for the Spring Boot backend; `@supabase/supabase-js` for admin features |
| Auth | Supabase Auth (admin login only — the rest of the app has no login) |

> **Note:** `axios` is listed in `package.json` but nothing in `src/`
> imports it — safe to remove if you want a leaner install.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← root layout, wraps every page in ThemeRegistry + AppShell
│   ├── page.tsx                  ← redirects "/" straight to the dashboard
│   ├── dashboard/                ← Control Room (public)
│   ├── incident/new/             ← Report Incident (public, the main real-world workflow)
│   ├── algorithms/                ← Algorithm Explorer index page (public)
│   ├── routing/                   ← individual algorithm demo: Dijkstra vs A*
│   ├── allocation/                ← individual algorithm demo: Greedy vs Knapsack DP
│   ├── network/                   ← individual algorithm demo: critical nodes / MST / centrality
│   ├── decision/                  ← individual algorithm demo: hospital ranking
│   ├── optimization/              ← individual algorithm demo: DP vs Backtracking vs Greedy
│   └── admin/                     ← login-gated Admin Panel
│       ├── layout.tsx               ← wraps every /admin/* route in AdminAuthGuard
│       ├── login/                   ← Supabase Auth sign-in form
│       └── dashboard/                ← the actual admin panel content
├── components/                   ← one form + one result-view component per algorithm page,
│                                    AppShell, and AdminAuthGuard
└── lib/                            ← one API client file per backend module, plus
                                       supabaseClient.ts / adminAuth.ts / adminDataApi.ts /
                                       incidentLocationApi.ts for direct-Supabase features
```

---

## Pages — What Each One Actually Does

### `/dashboard` — Control Room (public)

The system status screen: pending incident count, **ongoing incident
count**, available ambulances, a network-risk warning if any critical
road junction currently exists, and a hospital bed-availability table.
No login required, and it no longer has a Reset button — that moved to
the Admin Panel. A small text link ("Admin Panel") in the top-right
leads to `/admin/login`.

### `/incident/new` — Report Incident (public)

**This is the actual product.** A dispatcher fills in:
- Patient reference *(optional, validated — letters/numbers/spaces/hyphens
  only, blocks special characters)*
- Contact phone number *(optional, validated — used only by admins to
  verify the report is genuine, never shown publicly)*
- Condition, severity
- **Incident location** — a searchable Autocomplete, populated from the
  database (admin-managed, see below) instead of a hardcoded 3-item list

One submit (`POST /api/incident/report`) triggers the backend's full
orchestration, and the result renders as four cards: Hospital Match,
Dispatch Route, Resource Assignment, Dispatch Supply Plan. Nothing on
this page names which "task" produced which card — that's deliberate.

### `/algorithms` and its five sub-pages (public)

Unchanged — individual algorithm demos for testing and the VIVA. These
pages call the backend directly and **do not** change any database state.

### `/admin/login` — Admin Login

Email + password sign-in via **Supabase Auth**. Not a custom login table
— Supabase manages the account internally. There is exactly one admin
account, created manually from the Supabase Dashboard (see backend
README, "Running Locally").

### `/admin/dashboard` — Admin Panel (login required)

Redirects to `/admin/login` automatically if there's no active Supabase
session (enforced by `AdminAuthGuard`, wrapping every `/admin/*` route).
Once logged in:

- **Reset Demo Data** — same button/confirmation that used to live on the
  Control Room, now admin-only
- **Reported Incidents (Verification)** — every incident including phone
  number, so a report can be checked as genuine before more resources
  are committed to it
- **Add Ambulance / Resource** — insert a new row into the `resource`
  table directly (type, owner, status)
- **Add Supply Item** — insert a new row into `supply_item` directly
- **Manage Incident Locations** — add or remove entries in
  `incident_location`, the same table the public Report Incident page's
  searchable dropdown reads from

---

## Admin Panel — Why It Talks to Supabase Directly

Two different data paths exist for admin features, on purpose:

| Feature | Path |
|---|---|
| Login | Supabase Auth — zero backend involvement |
| Reset Demo Data, incident list | Spring Boot (`/api/admin/*`, `/api/incident/list`) |
| Add resource / supply item / incident location | Supabase's own REST API, called directly — bypasses Spring Boot |

**Why not build custom Spring Boot endpoints for everything?** The
skipped ones are plain database inserts with no algorithm involved.
Supabase already provides a full CRUD REST API for every table
automatically — routing a plain insert through a new Java
controller/service/DTO just to forward it to the same database adds a
layer with no real logic in it. Write access to those tables is
restricted to logged-in admins by **Row Level Security** policies (see
`database/08-schema-addition-admin-features.sql`), not by anything in
this frontend code — so this remains genuinely secure, not just
"security by obscurity."

**Why is login real, not a hardcoded password?** A hardcoded password or
a custom table checked by comparing strings in the browser is not
actually secure — anyone can read your Supabase URL and public key out of
the page source and query things directly. Supabase Auth checks passwords
on Supabase's own server, never in this browser code.

---

## `lib/` — API Client Files

| File | Talks to | Notes |
|---|---|---|
| `api.ts` | `/api/routing/*` | also exports the shared `BACKEND_URL` constant |
| `allocationApi.ts` | `/api/allocation/*` | |
| `networkApi.ts` | `/api/network/*` | |
| `decisionApi.ts` | `/api/decision/*` | |
| `optimizationApi.ts` | `/api/optimization/*` | |
| `incidentApi.ts` | `/api/incident/*`, `/api/admin/*` | includes `getIncidentList()` (admin) |
| `supabaseClient.ts` | Supabase directly | the only file that creates the Supabase client |
| `adminAuth.ts` | Supabase Auth | `signIn`, `signOut`, `getSession`, `onAuthStateChange` |
| `incidentLocationApi.ts` | `incident_location` table, directly | read (public) + write (admin) |
| `adminDataApi.ts` | `resource`, `ambulance_depot`, `supply_item` tables, directly | admin CRUD |

### Environment variables

Copy `.env.local.example` → `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

Get the Supabase values from Supabase Dashboard → Project Settings → API.
The anon key is safe to expose in frontend code by design — access
control is enforced by Row Level Security, not by hiding this key.

---

## `components/` — Shared UI Pieces

One `*Form.tsx` + one `*ResultView.tsx` pair per algorithm page, plus:
- `AppShell.tsx` — top bar and sidebar (Control Room / Report Incident /
  Algorithm Explorer), wraps every page via `layout.tsx`
- `AdminAuthGuard.tsx` — wraps every `/admin/*` route, redirects to
  `/admin/login` if there's no active Supabase session

---

## Running Locally

1. `npm install`
2. Make sure the backend is running on `http://localhost:8080`.
3. Copy `.env.local.example` → `.env.local` and fill in your Supabase
   project's URL and anon key.
4. Make sure your Supabase project has run `database/08-schema-addition-admin-features.sql`
   and `09-seed-incident-locations.sql`, and has one admin account created
   under Authentication → Users (see backend README).
5. `npm run dev`
6. Visit `http://localhost:3000` — it redirects straight to the Control Room.
7. To test the admin panel: click **Admin Panel** (top-right of Control
   Room), sign in with the account you created in step 4.

## Building for Production

```
npm run build
npm run start
```
