# Task Tracker — Running Instructions

Monorepo with an Express + MongoDB backend (`apps/api`) and an Expo React Native app (`apps/mobile`).

For architecture, schema, design rationale, and interview talking points see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

## Prerequisites

- Node.js **20 LTS** (a `.nvmrc` is included)
- MongoDB running locally, or a MongoDB Atlas connection string
- Expo Go app on your phone (or an Android/iOS emulator)

## 1. Install

From the repo root:

```bash
npm install
```

## 2. Configure environment

### Backend

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

### Mobile

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:4000
```

> When running through Expo Go on a physical phone, use your computer's LAN IP (e.g. `http://192.168.1.5:4000`). `localhost` resolves to the phone itself.

## 3. Run

Start the API (from repo root):

```bash
npm run api
```

In another terminal, start the mobile app:

```bash
npm run mobile
```

Then scan the QR code with Expo Go, or press `a` / `i` for an emulator.

## Scripts

Run from the repo root:

| Command             | What it does                            |
|---------------------|------------------------------------------|
| `npm run api`       | Start backend in watch mode (nodemon)    |
| `npm run mobile`    | Start Expo dev server                    |
| `npm run typecheck` | Run `tsc --noEmit` across all workspaces |
