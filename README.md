# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Create `.env.local` from `.env.example` and set your Convex deployment URL:

```bash
NUXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

`CONVEX_URL` is also supported for compatibility with existing local Convex env files.

Configure GitHub OAuth in the Convex deployment. These values are read by Convex functions during `/api/auth/callback/github`, so putting them only in `.env.local` is not enough:

```bash
npx convex env set AUTH_GITHUB_ID your-github-oauth-client-id
npx convex env set AUTH_GITHUB_SECRET your-github-oauth-client-secret
```

Your GitHub OAuth app callback URL should be:

```bash
https://your-convex-site-url.convex.site/api/auth/callback/github
```

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
