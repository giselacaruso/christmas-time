# Web app source code

A React, TypeScript and Vite web app. All of its code runs in the browser. It has no server code.

These steps describe the standard project setup. If the project was changed, check the scripts in `package.json` and `apps/vite/package.json`, and the settings in `apps/vite/vite.config.ts`.

## Run it on your computer

You need Node.js 22 or later and the pnpm version in the `packageManager` field of `package.json`. `corepack enable` sets up that pnpm version. On Node.js 25 or later, run `npm install -g corepack` first.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @vibe/app-vite dev
```

Open the local address that the terminal shows.

## Build and host it

```sh
pnpm --filter @vibe/app-vite build:client
```

1. Upload the contents of `apps/vite/dist/` to a static web host.
2. Configure the host to send `index.html` for app routes, so that a page such as `/about` loads when a user reloads it.

The build expects the app at the root of a domain. To host it under a path such as `/shop/`, build it with `pnpm --filter @vibe/app-vite exec vite build --base /shop/`.

## Notes

- The app source is in `apps/vite/client/` (the routes are in `App.tsx`). Shared UI components are in `packages/ui/`.
- Files from remote URLs need an internet connection.
- All code runs in the browser, so do not put secret keys in it.
