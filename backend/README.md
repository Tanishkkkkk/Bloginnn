# Bloginn — Backend API

Node.js + Express + TypeScript + Prisma + Supabase PostgreSQL

## Setup

1. Copy `.env.example` to `.env` and fill in your values
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Push schema to DB: `npm run db:push`
5. Start dev server: `npm run dev`

## API Base URL
`http://localhost:5000`

## Endpoints

### Auth
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout (clears cookies)
- `GET /api/auth/me` — Get current user (auth required)
- `POST /api/auth/refresh` — Refresh access token

### Posts
- `GET /api/posts` — List published posts (supports ?page, ?limit, ?category, ?tag)
- `GET /api/posts/:slug` — Get post by slug
- `GET /api/posts/mine` — Get current user's posts (auth required)
- `POST /api/posts` — Create post (auth required)
- `PUT /api/posts/:id` — Update post (auth required, author only)
- `DELETE /api/posts/:id` — Delete post (auth required, author only)

### Users
- `GET /api/users/:username` — Get user profile
- `PUT /api/users/profile` — Update profile (auth required)
- `POST /api/users/:username/follow` — Follow/unfollow user (auth required)

### Bookmarks
- `GET /api/bookmarks` — Get my bookmarks (auth required)
- `POST /api/bookmarks` — Bookmark a post (auth required)
- `DELETE /api/bookmarks/:id` — Remove bookmark (auth required)

### Claps
- `POST /api/claps` — Clap for a post (auth required, max 50 per user per post)

### Search
- `GET /api/search?q=query` — Search published posts (supports ?page, ?limit)

## Database Schema
- **User** — Auth, profile, roles (READER, WRITER, ADMIN)
- **Post** — Content with status (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED), tags, SEO, reading time
- **Category** — Post categories with slugs
- **Bookmark** — User saved posts
- **Follow** — User follow relationships
- **Clap** — Medium-style claps (max 50 per user per post)
- **PostView** — View tracking (authenticated & anonymous)
