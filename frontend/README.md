# 🎨 Bloginn (StoryForge) — Frontend Client Application

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.design&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

This is the Next.js App Router client application for the **Bloginn** ecosystem. It features rich obsidian styling, fluid framer-motion physical animations, interactive canvas particles, and a fully mount-guarded rich text writing workflow.

---

## 🚀 Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env.local` file in the root of the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify Production Compilation:**
   To make sure there are no SSR or serialization boundaries broken:
   ```bash
   npm run build
   ```

---

## 📂 Codebase Blueprint

* `/app`: Route directories matching the Next.js App Router paradigm.
  * `/app/page.tsx`: Landing entry, spawning the custom visual splash screen.
  * `/app/globals.css`: System variables, typography setups, scrollbars, and card designs.
  * `/app/dashboard`: Writer workbench, displaying post statistics and editing panels.
* `/components`: High-quality custom interactive React elements.
  * `SplashAnimation.tsx`: Canvas particle engine, SVG loop, letter drawing, and clip-path circular contraction exit.
  * `HomeContent.tsx`: Interactive staggered springs load-in choreography.
  * `TipTapEditor.tsx`: Mount-guarded rich WYSIWYG editor containing format toolbars and counts.
* `/store`: Zustand state slices (e.g. auth state tracking).
