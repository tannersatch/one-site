# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Install Developer Tools

The `/tools` section is an installable progressive web app. Its manifest ID,
start URL, and scope are `/tools`, which includes the tools directory itself as
well as its child routes. The homepage, portfolio, and other sections do not
advertise this manifest or register the service worker.

- Chrome/Edge: open `/tools` and use the browser's install-app button or menu.
- Safari on macOS: open `/tools` and choose File > Add to Dock.
- Safari on iPhone/iPad: open `/tools`, then Share > Add to Home Screen.

Production requires HTTPS (localhost/loopback also works for testing). PWA
registration is disabled during `pnpm dev` so development assets are not cached.
Test a production build with `pnpm build` followed by `pnpm preview`.

The tools directory and built JavaScript/CSS/fonts are precached. Other tool
pages can reopen offline after being visited while the worker is active, with
up to 40 page responses retained for seven days. Never-visited pages and external
resources are not guaranteed offline. Pasted input is not persisted by the PWA.

New builds show an update banner instead of automatically reloading a tool.
Save any work before choosing Update, since updating reloads the current page.

The generated `/tools-sw.js` lives at the origin root but is registered with a
`/tools` scope, not `/`. Installation icons live in `public/tools`; regenerate
them from the existing favicon with `node scripts/generate-pwa-icons.mjs`.
