# 🌟 Bloginn (StoryForge) — Where Ideas Come Alive

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.design&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Bloginn** is a premium, SEO-first, Medium-inspired publishing ecosystem built for creators and curious minds. Engineered using Next.js App Router, Express, and PostgreSQL, the platform bridges fast static pre-rendering, rich dynamic interactions, and responsive aesthetics.

---

## 🎨 Design & Aesthetic Excellence

* **Obidian Dark Mode:** An ultra-premium, dark glassmorphism aesthetic built on a `#0a0a0f` obsidian canvas.
* **Ambient Stardust Entrance:** A mouse-interactive canvas-based stardust particle engine that responds to cursor movements dynamically on load.
* **Glow Portal Transitions:** Fast, responsive SVG infinity vector wipes that seamlessly transition loaders to content sections.
* **Tactile Staggered Parallax:** A fully choreographed staggered slide-in for heroes, sidebars, and feeds using `framer-motion` springs.

---

## ⚙️ Architecture Overview

The codebase is organized as a high-performance **monorepo**:

```text
├── backend/               # Node.js/Express REST API Engine
│   ├── src/
│   │   ├── controllers/   # Route handler logic
│   │   ├── routes/        # Router declarations
│   │   ├── middleware/    # JWT & authentication filters
│   │   ├── services/      # Business logic Layer
│   │   └── config/        # Environment configurations
│   └── prisma/            # Database schema & migrations
│
└── frontend/              # Next.js 16 (App Router) Client App
    ├── app/               # Public and dashboard client routes
    ├── components/        # Dynamic interactive React primitives
    ├── store/             # Zustand state management slices
    └── public/            # High-fidelity SVG and static assets
```

---

## 🚀 Key Features

### 📖 Reader Space
- [x] **Ambient Exploration:** Smooth feeds with tag/category filters.
- [x] **Infinite Content discovery:** Staggered lazy-loading posts feed.
- [x] **Search Engine:** Real-time query searches for tags, posts, and authors.
- [ ] **Engagement (In Progress):** Reactive article claps, bookmarking, and following systems.

### ✍️ Creator Space
- [x] **TipTap Rich Text Editor:** Seamless typing with a mount-guarded, client-side WYSIWYG editor containing formatting, link inserts, and image embeds.
- [x] **Autosave Engine:** High-reliability background drafts auto-saving every 30 seconds.
- [x] **Dashboard Workspace:** Comprehensive article hub showing draft/published lists.

### 🔒 Enterprise Foundations
- [x] **Secure JWT Session Flow:** Double-cookie accessToken + refreshToken cycle.
- [x] **Optimized Next.js Builds:** Server-side rendered layouts matching fully isolated Client Component code.

---

## ⚡ Quickstart

### 1. Prerequisites
* **Node.js** (v20+ recommended)
* **PostgreSQL** (v15+ instance)

### 2. Backend Installation & Start
```bash
cd backend
npm install
# Set up environment variables (.env)
npx prisma migrate dev
npm run dev
```

### 3. Frontend Installation & Start
```bash
cd ../frontend
npm install
# Set up client environmental configuration (.env.local)
npm run dev
```
Navigate to `http://localhost:3000` to experience Bloginn!
