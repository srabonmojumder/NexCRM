<div align="center">

# NexCRM

### Modern CRM for ambitious teams

A premium customer-relationship platform with deal pipelines, analytics, messaging and revenue intelligence — built for fast-moving sales orgs.

**🔗 Live:** [nexcrm-admin.web.app](https://nexcrm-admin.web.app)

![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-ffca28?logo=firebase&logoColor=black)

</div>

---

## ✨ Overview

NexCRM is a fully responsive, dark/light-themed CRM dashboard built as a frontend reference app. It ships a complete sales workflow — dashboard, pipeline kanban, leads, clients, invoices, analytics, team, calendar and messaging — backed by a mock data layer so it runs entirely on the client with no backend required.

## 🎯 Features

- **Dashboard** — KPI stat cards with animated counters, revenue & traffic charts, top deals, recent activity, upcoming meetings
- **Pipeline** — drag-and-drop Kanban board (`@dnd-kit`) for moving deals across stages
- **Leads & Clients** — sortable, filterable tables with detail views
- **Analytics** — funnel, conversion, channel, goals and sales charts (Recharts) + interactive world map (Leaflet)
- **Invoices** — billing list with status tracking
- **Messages** — chat UI with emoji picker and unified file-upload menu (image, video, pdf, excel, word, audio)
- **Calendar, Team, Activity, Notifications, Settings** — full supporting pages
- **Command menu** (`⌘K`), global search, collapsible sidebar, notifications
- **Premium design system** — glassmorphism, layered soft shadows, gradient accents, framer-motion transitions
- **Dark / light mode** with persisted preference

## 🧱 Tech Stack

| Area | Tooling |
|------|---------|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript |
| Styling | Tailwind CSS · SCSS · `tailwindcss-animate` · CVA |
| UI | Radix UI primitives · shadcn-style components · lucide-react |
| State | Zustand · TanStack Query |
| Charts / Maps | Recharts · React-Leaflet |
| Motion | Framer Motion |
| Forms | React Hook Form · Zod |
| Hosting | Firebase Hosting (static export) |

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build / static export to `out/` |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## 📦 Project Structure

```
src/
├── app/              # Next.js App Router — (auth) & (dashboard) route groups
├── components/       # UI primitives, layout, charts, dashboard, kanban, maps
├── layouts/          # Dashboard shell (sidebar + topbar)
├── store/            # Zustand stores (ui, auth, pipeline, notifications)
├── services/         # Mock API layer
├── data/             # Mock seed data
├── hooks/ · lib/ · types/ · styles/
```

> A deeper architecture guide lives in [DOCUMENTATION.md](DOCUMENTATION.md).

## 🌐 Deployment

The app is configured for **static export** and hosted on **Firebase Hosting**.

```bash
# build the static site (outputs to ./out)
npm run build

# deploy to Firebase
firebase deploy --only hosting
```

- Live site: **https://nexcrm-admin.web.app**
- Hosting config: [`firebase.json`](firebase.json) — `public: "out"`, clean URLs, immutable caching for `_next/static`
- Static export is enabled via `output: "export"` in [`next.config.mjs`](next.config.mjs)

## 📄 License

Private project — all rights reserved.
