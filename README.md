# Task Tracker

A full-stack task tracker built as a monorepo: an Express + MongoDB backend and an Expo (React Native) mobile app, sharing types and validation schemas through a workspace package.

## Stack

- **Mobile** — Expo SDK 50, React Native, TypeScript, expo-router, TanStack Query, axios, expo-secure-store, zod
- **Backend** — Node.js, Express, TypeScript, Mongoose, JWT, bcrypt, zod
- **Shared** — `@task-tracker/shared` package exporting TS types + zod schemas used by both apps
- **Tooling** — npm workspaces

## Repository layout

```
task-tracker/
├── apps/
│   ├── api/         Express + MongoDB API
│   └── mobile/      Expo app
├── packages/
│   └── shared/      types + zod schemas (consumed by both apps)
├── package.json     workspaces root
├── README.md        ← you are here
└── ARCHITECTURE.md  design / interview deep-dive
```

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the design rationale, request lifecycle, schema details, and patterns used (TanStack Query optimistic updates, route-group auth guards, JWT flow, etc.).

## Prerequisites

- Node.js **20+** (an `.nvmrc` is included)
- npm **9+** (ships with Node 20)
- MongoDB — either local (`mongod`) or a free MongoDB Atlas connection string
- Expo Go app on your phone (or an Android/iOS simulator)

## Setup

From the repo root:

```bash
npm install
```

This installs all workspaces in one pass.

### Backend env

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/task_tracker
JWT_SECRET=replace-me-with-a-long-random-string
JWT_EXPIRES_IN=7d
```

### Mobile env

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:4000
```

> When running the app on a physical device through Expo Go, use your computer's LAN IP (e.g. `http://192.168.1.5:4000`) — `localhost` resolves to the phone itself, not your laptop.

## Run

Start the API (from repo root):

```bash
npm run api
```

In another terminal, start the mobile app:

```bash
npm run mobile
```

Then scan the QR code with Expo Go.

## API reference

All `/tasks` routes require `Authorization: Bearer <token>`.

| Method | Path              | Auth | Body                                         | Response                  |
|--------|-------------------|------|----------------------------------------------|---------------------------|
| POST   | `/auth/signup`    | —    | `{ name, email, password }`                  | `{ user, token }`         |
| POST   | `/auth/login`     | —    | `{ email, password }`                        | `{ user, token }`         |
| GET    | `/tasks`          | ✅   | — (query: `?completed=true|false`)           | `{ tasks: Task[] }`       |
| POST   | `/tasks`          | ✅   | `{ title, description? }`                    | `{ task: Task }`          |
| PATCH  | `/tasks/:id`      | ✅   | `{ title?, description?, completed? }`       | `{ task: Task }`          |
| DELETE | `/tasks/:id`      | ✅   | —                                            | `204 No Content`          |
| GET    | `/health`         | —    | —                                            | `{ status: "ok" }`        |

Errors come back as `{ message: string, details?: unknown }` with appropriate HTTP status codes.

## Scripts

Run from the repo root:

| Command                | What it does                            |
|------------------------|------------------------------------------|
| `npm run api`          | Start backend in watch mode (nodemon)    |
| `npm run mobile`       | Start Expo dev server                    |
| `npm run typecheck`    | Run `tsc --noEmit` across all workspaces |

## Demo video

_Add the link to your Loom/Drive recording here once recorded._

## Notes

- Passwords are hashed with bcrypt (cost 10), never returned by the API.
- Tasks are scoped to the authenticated user via a server-side `userId` filter — clients cannot read or mutate other users' tasks.
- Auth tokens are stored in `expo-secure-store` (Keychain on iOS, Keystore on Android).
- Login is persisted: closing and reopening the app keeps the user signed in.
