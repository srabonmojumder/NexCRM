# NexCRM — System Documentation

A developer's guide to the architecture, structure, and behavior of the NexCRM web application.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Main Features](#3-main-features)
4. [Project Structure](#4-project-structure)
5. [Routing & Page Flow](#5-routing--page-flow)
6. [Modules & Sections](#6-modules--sections)
7. [Component Architecture](#7-component-architecture)
8. [Styling / SCSS Architecture](#8-styling--scss-architecture)
9. [State Management](#9-state-management)
10. [Data Flow](#10-data-flow)
11. [Widgets & Integrations](#11-widgets--integrations)
12. [Setup & Development Notes](#12-setup--development-notes)

---

## 1. System Overview

**NexCRM** is a modern, front-end customer relationship management (CRM) dashboard. It presents a complete sales-org workspace — pipeline management, analytics, client/lead tracking, messaging, calendar, invoicing, and team management — wrapped in a polished, animated, glassmorphism UI with light/dark theming.

**Important:** NexCRM is currently a **front-end / demo application**. There is **no backend or database**. All content is served from a single in-memory mock dataset (`src/data/mock.ts`). Actions such as signing in, moving deals, or marking notifications read mutate **client-side state only** and reset on a hard reload (except the two values that are intentionally persisted — see [State Management](#9-state-management)).

This makes the codebase an excellent UI/architecture reference: the data layer is cleanly isolated, so swapping the mock for a real API is a contained change.

---

## 2. Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js `14.2.13` (App Router) |
| Language | TypeScript `5.x`, React `18.3` |
| Styling | Tailwind CSS `3.4` + SCSS (`sass`) |
| State | Zustand `4.5` |
| Server state (scaffolded) | TanStack React Query `5.x` |
| Charts | Recharts `2.12` |
| Maps | Leaflet + React-Leaflet |
| Animation | Framer Motion `11` |
| UI primitives | Radix UI (`@radix-ui/*`) |
| Command palette | `cmdk` |
| Icons | `lucide-react`, `react-icons` |
| Theming | `next-themes` |
| Toasts | `sonner` |
| Dates | `date-fns` + `Intl` |

**Path alias:** `@/*` maps to `./src/*` (configured in `tsconfig.json`).

---

## 3. Main Features

- **Dashboard** — KPI stat cards with animated count-up + sparklines, revenue/traffic/channel/goal charts, recent activity feed, upcoming meetings, top deals, and a global client distribution map.
- **Analytics** — Micro-stat strip plus a suite of charts (sales analytics, revenue & profit, conversion funnel, traffic sources, conversion rate, channel performance, goal tracker).
- **Sales Pipeline** — A 6-stage Kanban board with drag-and-drop deal management and live weighted-value metrics.
- **Leads / Clients / Team** — Sortable, filterable data tables of records.
- **Calendar** — Month-grid scheduling view with typed events.
- **Messages** — Two-pane conversation/messaging UI.
- **Invoices** — Invoice list with statuses (draft/sent/paid/overdue/cancelled).
- **Activity** — Chronological audit feed of system events.
- **Notifications** — Notification center with read/unread state.
- **Settings** — Workspace configuration screens.
- **Global UI** — Collapsible sidebar, mobile drawer, ⌘K command palette, light/dark theme toggle, notifications menu, user menu.
- **Auth screens** — Login, Register, Forgot Password (mock authentication).

---

## 4. Project Structure

```
NexCRM/
├── next.config.mjs        # Next config (image remote hosts, strict mode)
├── tailwind.config.ts     # Design tokens, colors, keyframes, animations
├── postcss.config.mjs     # PostCSS (Tailwind + Autoprefixer)
├── tsconfig.json          # TS config + "@/*" path alias
├── public/                # Static assets (logos, images)
└── src/
    ├── app/               # Next.js App Router (routes + layouts)
    │   ├── layout.tsx          # Root layout: fonts, <Providers>, metadata
    │   ├── (auth)/             # Route group — auth screens
    │   └── (dashboard)/        # Route group — the CRM app
    ├── layouts/
    │   └── dashboard-layout.tsx  # Shared dashboard shell (sidebar + topbar + main)
    ├── components/
    │   ├── ui/             # Low-level primitives (Radix/shadcn-style)
    │   ├── layout/         # Sidebar, topbar, navigation, menus
    │   ├── common/         # Providers, PageHeader, Logo, EmptyState
    │   ├── dashboard/      # Dashboard-specific widgets
    │   ├── charts/         # Recharts chart components
    │   ├── kanban/         # Pipeline Kanban board
    │   ├── calendar/       # Calendar widget
    │   └── maps/           # Leaflet world map (+ dynamic loader)
    ├── store/             # Zustand stores (client state)
    ├── data/
    │   └── mock.ts        # Single source of all demo data
    ├── services/
    │   └── api.ts         # Mock async API layer (scaffolded)
    ├── hooks/             # Custom React hooks
    ├── lib/
    │   └── utils.ts       # cn() + formatting helpers
    ├── types/
    │   └── index.ts       # Shared domain TypeScript types
    └── styles/
        └── globals.scss   # Global styles, CSS variables, utilities
```

### Naming conventions

- Files: `kebab-case.tsx` / `.ts`.
- Components: `PascalCase`, exported as **named exports** (not default) — except Next.js route files (`page.tsx`, `layout.tsx`), which must default-export.
- Most interactive components are Client Components (`"use client"`); server components are used only where they add value (e.g. reading cookies).

---

## 5. Routing & Page Flow

NexCRM uses the **Next.js App Router** with two **route groups**. Route groups (`(name)`) organize files and let each group own a distinct layout **without** adding a URL segment.

### Route map

| URL | File | Layout |
|---|---|---|
| `/login` | `app/(auth)/login/page.tsx` | Auth |
| `/register` | `app/(auth)/register/page.tsx` | Auth |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Auth |
| `/` | `app/(dashboard)/page.tsx` | Dashboard |
| `/analytics` | `app/(dashboard)/analytics/page.tsx` | Dashboard |
| `/leads` | `app/(dashboard)/leads/page.tsx` | Dashboard |
| `/clients` | `app/(dashboard)/clients/page.tsx` | Dashboard |
| `/pipeline` | `app/(dashboard)/pipeline/page.tsx` | Dashboard |
| `/invoices` | `app/(dashboard)/invoices/page.tsx` | Dashboard |
| `/calendar` | `app/(dashboard)/calendar/page.tsx` | Dashboard |
| `/messages` | `app/(dashboard)/messages/page.tsx` | Dashboard |
| `/team` | `app/(dashboard)/team/page.tsx` | Dashboard |
| `/activity` | `app/(dashboard)/activity/page.tsx` | Dashboard |
| `/notifications` | `app/(dashboard)/notifications/page.tsx` | Dashboard |
| `/settings` | `app/(dashboard)/settings/page.tsx` | Dashboard |

### Layout hierarchy

```
RootLayout (app/layout.tsx)
│  • loads Google fonts (Inter, Sora, JetBrains Mono) as CSS variables
│  • wraps everything in <Providers>
│
├── (auth)/layout.tsx        → split-screen marketing panel + form column
│
└── (dashboard)/layout.tsx   → server component; reads sidebar cookie,
                               then renders <DashboardLayout>
```

The dashboard route-group layout is a **Server Component**. It reads the `nexcrm-sidebar-collapsed` cookie via `next/headers` and passes `defaultCollapsed` into the client `DashboardLayout`. This lets the server render the sidebar in its final collapsed/expanded shape, eliminating the post-hydration "flash" (FOUC).

### Navigation flow

- The **Sidebar** (desktop) and **MobileNav** drawer both render from a shared nav config: `src/components/layout/sidebar-nav.ts` (`navSections`).
- Auth pages are independent screens; "signing in" (mock) routes the user to `/` via `next/navigation`'s `router.push`.
- There is **no route guard / middleware** — all dashboard routes are publicly reachable. Auth is cosmetic.

---

## 6. Modules & Sections

Each "module" is a route page plus its supporting components, stores, and slice of mock data.

### Dashboard (`/`)
Composition page only. Pulls `stats` from mock data and arranges `StatCard`, chart, and feed widgets in a responsive grid. No local state.

### Analytics (`/analytics`)
A static analytics composition: a micro-stat strip + multiple `charts/*` components. Each chart reads its own named series from `mock.ts`.

### Pipeline (`/pipeline`)
The most interactive module.
- Backed by **`usePipelineStore`** (Zustand) — holds the live `deals[]` array.
- `KanbanBoard` renders 6 stage columns (`prospecting → qualified → proposal → negotiation → won → lost`).
- Drag-and-drop uses the **native HTML5 Drag & Drop API** (`onDragStart` / `onDrop` / `dataTransfer`). Dropping a card calls `moveDeal(id, stage)`, which also auto-sets probability (won = 100%, lost = 0%).
- The page header recomputes total / weighted / won pipeline value from the store on every render.

### Leads / Clients / Team (`/leads`, `/clients`, `/team`)
Data-table modules. Each page imports its collection directly from `mock.ts` and renders sortable/filterable tables built on the `ui/table` primitives.

### Messages (`/messages`)
Two-pane layout: a conversation list + a message thread. Reads `conversations` and the `messages` map (keyed by conversation id) from mock data.

### Calendar (`/calendar`)
Renders `CalendarWidget`, a month grid that places typed `CalendarEvent`s (`meeting`, `call`, `demo`, `follow-up`, `internal`).

### Invoices (`/invoices`)
Invoice table with status badges driven by `InvoiceStatus`.

### Activity (`/activity`)
Chronological feed of `Activity` records, each with a `kind` (deal won, invoice paid, etc.) that maps to an icon/style.

### Notifications (`/notifications`)
Backed by **`useNotificationsStore`**. Supports `markRead`, `markAllRead`, `remove`, and a derived `unreadCount()`. The topbar `NotificationsMenu` reads the same store, so the unread badge stays in sync.

### Settings (`/settings`)
Static configuration screens (profile, workspace, preferences).

---

## 7. Component Architecture

Components are grouped by **responsibility level**:

### `components/ui/` — Primitives
Low-level, reusable, mostly unstyled-logic components — the design-system layer. These wrap **Radix UI** primitives in the shadcn/ui style: `button`, `card`, `dialog`, `dropdown-menu`, `select`, `popover`, `tooltip`, `table`, `tabs`, `input`, `checkbox`, `switch`, `badge`, `avatar`, `progress`, `skeleton`, `scroll-area`, `command`, etc.

- **Variants** are defined with `class-variance-authority` (CVA). Example: `Button` exposes `variant` (`default | gradient | destructive | outline | secondary | ghost | glass | link`) and `size`.
- `Card` supports `variant` = `default | glass | gradient | subtle`.
- All accept `className` and merge it via the `cn()` helper (`clsx` + `tailwind-merge`).

### `components/layout/` — App shell
`Sidebar` (desktop, collapsible), `MobileNav` (slide-in drawer), `Topbar`, `CommandMenu` (⌘K palette), `NotificationsMenu`, `UserMenu`, `ThemeToggle`. `sidebar-nav.ts` is the **single source of nav items**; `sidebar-shared.tsx` holds the shared `SidebarNavList` rendered by **both** desktop and mobile so the two never diverge.

### `components/common/` — Cross-cutting
`Providers` (see [Data Flow](#10-data-flow)), `PageHeader` (animated title/description/actions block used by every page), `Logo` / `LogoMark`, `EmptyState`.

### `components/dashboard/` — Feature widgets
`StatCard`, `RecentActivity`, `UpcomingMeetings`, `TopDeals` — dashboard-specific compositions.

### `components/charts/`, `kanban/`, `calendar/`, `maps/` — Domain components
Self-contained feature components consumed by their respective pages.

### Layout composition

```
DashboardLayout (src/layouts/dashboard-layout.tsx)
├── background grid + radial-fade decorations (fixed, -z-10)
├── <Sidebar />        — fixed, left; CSS width transition (264px ⇄ 80px)
└── <main>             — left padding tracks the sidebar width
    ├── <Topbar />     — sticky; contains MobileNav trigger, search,
    │                    theme toggle, notifications, user menu
    └── page content
```

The sidebar width and the `main` left-padding are kept in sync by constants (`lg:pl-[288px]` expanded / `lg:pl-[104px]` collapsed). The collapsed state lives in `useUIStore` and is mirrored to a cookie.

---

## 8. Styling / SCSS Architecture

Styling is a hybrid of **Tailwind utility classes** (the default for component markup) and **one global SCSS file** for tokens and reusable composite classes.

### `src/styles/globals.scss`

Organized with Tailwind's `@layer` directives:

1. **`@layer base` — Design tokens.** CSS custom properties defined as **HSL channel triplets** (e.g. `--primary: 226 100% 61%`) under `:root` (light) and `.dark` (dark). Storing raw channels lets Tailwind apply opacity: `hsl(var(--primary) / 0.1)`. Theme switching = toggling the `.dark` class on `<html>`.
2. **`@layer base` — Element defaults.** Global border color, body background (layered radial gradients), `::selection`, font smoothing.
3. **`@layer components` — Composite classes:**
   - `.glass`, `.glass-strong`, `.glass-subtle` — the glassmorphism surfaces (translucent background + `backdrop-filter` blur/saturate). Used everywhere via `Card variant="glass"`.
   - `.gradient-text`, `.gradient-border` — brand gradient effects.
   - `.scrollbar-thin` — custom slim scrollbars.
   - `.glow-primary`, `.card-hover` — interaction effects.
4. **`@layer utilities`** — `.text-balance`, `.no-scrollbar`, `.mask-fade-r/-b`.

### `tailwind.config.ts`

- `darkMode: ["class"]` — class-based theming.
- `content` globs cover `src/components`, `src/app`, `src/layouts`, `src/pages`.
- **Colors** map to the CSS variables (`primary`, `success`, `warning`, `info`, `card`, `border`, …) plus a static `brand` palette (`brand-50…950`).
- **`borderRadius`** derives `sm/md/lg/xl/2xl` from a single `--radius` token.
- **`backgroundImage`** — `grid-pattern`, `radial-fade`, `brand-gradient`.
- **`keyframes` / `animation`** — `shimmer`, `fade-in`, `pulse-soft`, `float`, accordion. Radix-style enter/exit animations come from the `tailwindcss-animate` plugin.

### Conventions

- **Prefer Tailwind utilities** in JSX. Reach for `globals.scss` only for tokens or a class reused across many unrelated components.
- Always merge incoming `className` via `cn()` so consumers can override.
- Color opacity uses the slash syntax: `bg-primary/10`, `text-foreground/80`.

> ⚠️ **`backdrop-filter` gotcha:** any element with `.glass*` (or a `transform`) becomes a *containing block* for `position: fixed` descendants. Fixed overlays must therefore be rendered via a **portal to `document.body`** (as `MobileNav` does) — not nested inside a glass container.

### Fonts

Loaded in `app/layout.tsx` with `next/font/google` and exposed as CSS variables: **Inter** (`--font-sans`), **Sora** (`--font-display`), **JetBrains Mono** (`--font-mono`).

---

## 9. State Management

There is **no global Redux-style store**. State is split into small, focused **Zustand** stores under `src/store/`, plus React Query scaffolding.

| Store | Purpose | Persistence |
|---|---|---|
| `ui-store.ts` | `sidebarCollapsed`, `commandOpen`, `notificationsOpen` + setters | `sidebarCollapsed` → **cookie** (`nexcrm-sidebar-collapsed`). The others are in-memory only. |
| `auth-store.ts` | `user`, `isAuthenticated`, `signIn`, `signOut` | Zustand `persist` → **localStorage** (`nexcrm-auth`) |
| `pipeline-store.ts` | `deals[]`, `moveDeal`, `addDeal` | In-memory (resets on reload) |
| `notifications-store.ts` | `items[]`, `unreadCount()`, `markRead`, `markAllRead`, `remove` | In-memory |

### Why the sidebar uses a cookie

A persisted store that hydrates from `localStorage` only *after* the client mounts causes a layout flash: the server renders the default, then the client corrects it. By storing `sidebarCollapsed` in a **cookie**, the dashboard's **server-component layout** can read it with `next/headers` and render the correct width immediately — no flash. The store seeds itself from the server-provided value on first render.

### Other state

- **Local component state** (`useState`) for ephemeral UI — drawer open/close, drag state, form inputs.
- **`next-themes`** owns the light/dark theme (its own provider + localStorage + pre-paint script).
- **TanStack React Query** — a `QueryClient` is created in `Providers`, but the app does **not** currently call `useQuery`/`useMutation`. It is scaffolding for a future real API.

---

## 10. Data Flow

### The data source

Everything originates from **`src/data/mock.ts`** — typed collections (`stats`, `leads`, `clients`, `deals`, `team`, `events`, `conversations`, `messages`, `invoices`, `activity`, `notifications`, `revenueSeries`, `salesAnalyticsSeries`, …). Domain shapes live in `src/types/index.ts`.

### Three consumption paths

```
                         ┌───────────────────────────┐
                         │     src/data/mock.ts       │
                         │   (typed demo dataset)     │
                         └────┬───────────┬───────────┘
                              │           │
        ┌─────────────────────┘           └──────────────────┐
        │                                                    │
1. DIRECT IMPORT                              2. SEEDS A ZUSTAND STORE
   Page imports a collection                     Store initializes from mock,
   and renders it. Read-only.                    then owns mutable state.
   e.g. /leads, /clients, /team,                 e.g. pipeline-store ← deals
        /analytics, dashboard                         notifications-store ← notifications
        │                                            │
        ▼                                            ▼
   React component tree                         Components subscribe via the
                                                store hook; mutations re-render
                                                only subscribers.

3. MOCK API (scaffolded, not yet wired)
   src/services/api.ts exposes async getters (getLeads(), getDeals(), …)
   with a simulated ~120 ms delay — intended to back React Query later.
```

- **Read-only pages** import mock collections directly — simplest path, no store needed.
- **Interactive modules** (pipeline, notifications) seed a Zustand store from the mock data once, then mutate the store. UI updates because components subscribe with selector hooks (`usePipelineStore(s => s.deals)`).
- **`services/api.ts`** mirrors the eventual real-API surface (promise-returning, latency-simulated). It's currently **unused** — the migration path is: implement these functions against a real backend, then consume them with React Query.

### Provider tree

`app/layout.tsx` → `<Providers>` (`components/common/providers.tsx`):

```
<ThemeProvider>            (next-themes — class strategy, dark default)
  <QueryClientProvider>    (TanStack Query client)
    {children}
    <Toaster />            (sonner — bottom-right, theme-aware toasts)
```

### Rendering model

- The **app is overwhelmingly client-rendered** — most pages and components are `"use client"` (they use stores, hooks, animation, charts).
- The notable **server component** is `(dashboard)/layout.tsx`, which reads the sidebar cookie before render.
- `app/layout.tsx` sets `<html suppressHydrationWarning>` because `next-themes` mutates the class list before React hydrates.

---

## 11. Widgets & Integrations

### Charts — Recharts (`components/charts/`)
`RevenueChart`, `SalesAnalyticsChart`, `ChannelChart`, `ConversionChart`, `FunnelChart`, `GoalsChart`, `TrafficChart`. Each is self-contained: imports its series from `mock.ts`, wraps a Recharts chart in `<ResponsiveContainer>`, and uses a custom `glass-strong` tooltip + theme-aware colors (`hsl(var(--…))`). Place a chart inside a fixed-height `CardContent` (`<ResponsiveContainer>` needs a measured parent).

### Map — Leaflet (`components/maps/`)
`WorldMap` renders client distribution on a Leaflet map. Because Leaflet touches `window`/`document`, it **cannot be server-rendered**: `world-map-loader.tsx` imports it via `next/dynamic` with `ssr: false` and a `<Skeleton>` fallback. **Always import `WorldMapLoader`, never `WorldMap` directly.**

### Kanban — native Drag & Drop (`components/kanban/`)
`KanbanBoard` implements drag-and-drop with the **browser's native HTML5 DnD API** (`draggable`, `onDragStart`, `onDragOver`, `onDrop`). Dropping commits via `pipeline-store.moveDeal()`. Framer Motion animates card enter/exit/reorder.
> Note: `@dnd-kit/*` is installed but **not used** by the current board.

### Command palette — cmdk
`CommandMenu` (in the topbar) is a `cmdk`-powered ⌘K / Ctrl+K palette for quick navigation and actions. Open state lives in `useUIStore.commandOpen`. It is rendered inside a Radix `Dialog` (portaled to `body`).

### Stat cards
`StatCard` combines an **animated count-up** (`useCountUp` hook — `requestAnimationFrame` with cubic ease-out), a Recharts sparkline, a delta badge, a Framer Motion entrance, and a hover glow.

### Toasts — sonner
A single `<Toaster>` lives in `Providers`. Trigger toasts anywhere with `import { toast } from "sonner"`.

### Theme toggle — next-themes
`ThemeToggle` flips `next-themes`. Default theme is **dark**; system theme is disabled (`enableSystem={false}`).

### Notifications menu
`NotificationsMenu` (topbar) is a Radix dropdown bound to `useNotificationsStore`; its unread badge stays in sync with the `/notifications` page because both read the same store.

### Animation — Framer Motion
Used for page-header entrances, stat-card reveals, kanban card transitions, menu/drawer motion. Respects `prefers-reduced-motion` where `motion-reduce:` utilities are applied.

---

## 12. Setup & Development Notes

### Prerequisites
- Node.js **18.17+** (recommended 20+)
- npm (a `package-lock.json` is committed)

### Install & run

```bash
npm install      # install dependencies
npm run dev      # start dev server → http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (next lint)
```

There is **no `.env` file and no environment configuration** — the app is fully self-contained on mock data.

### Type checking
Run a standalone type check with:

```bash
npx tsc --noEmit
```

### Adding a new page

1. Create `src/app/(dashboard)/<name>/page.tsx` with a **default-exported** component.
2. Add the route to `navSections` in `src/components/layout/sidebar-nav.ts` so it appears in both the desktop sidebar and mobile drawer.
3. Optionally add it to `CommandMenu` for ⌘K access.
4. Start the page with `<PageHeader title=… description=… />`.

### Adding new data

- Add the typed collection to `src/data/mock.ts` and its interface to `src/types/index.ts`.
- For read-only display, import it directly into the page.
- For mutable data, create or extend a Zustand store seeded from the mock collection.

### Conventions checklist

- Components use **named exports**; route files use **default exports**.
- Add `"use client"` to any component using hooks, stores, browser APIs, or animation.
- Always merge `className` through `cn()`.
- Use the `lib/utils.ts` formatters (`formatCurrency`, `formatCompact`, `formatRelativeTime`, `getInitials`, …) rather than ad-hoc formatting.
- Theme via CSS-variable tokens (`bg-card`, `text-muted-foreground`) — never hard-coded hex — so light/dark both work.
- Render `position: fixed` overlays through a portal to `document.body` to escape `.glass*` containing blocks.
- Charts need a fixed-height parent container.

### Known scaffolding (installed but currently unused)

These dependencies are present for a planned next phase; a new developer should not assume they are wired in:

- **`@tanstack/react-query`** — provider configured, but no `useQuery` calls yet.
- **`src/services/api.ts`** — mock async API, not yet consumed.
- **`@dnd-kit/*`** — the Kanban board uses native HTML5 DnD instead.
- **`react-hook-form` / `@hookform/resolvers` / `zod`** — auth forms currently use plain `useState`.
- **`vaul`** — drawer library, not currently used (`MobileNav` is hand-built).

### Behavioral notes

- **Auth is cosmetic** — no route protection; `signIn`/`signOut` only flip `auth-store` state (persisted to localStorage).
- **Most mutations are session-only** — moving deals, reading notifications, etc. reset on hard reload. Only `auth-store` (localStorage) and the sidebar collapsed state (cookie) survive.
- **Images** — remote avatar/photo hosts must be allow-listed in `next.config.mjs` (`images.remotePatterns`): currently Unsplash, DiceBear, Pravatar.
- **React Strict Mode** is on — expect double-invoked effects in development.

---

*This document reflects the codebase as a front-end demo. When a real backend is introduced, the primary integration points are `src/services/api.ts` (implement against the API) and the React Query provider already wired in `components/common/providers.tsx`.*
