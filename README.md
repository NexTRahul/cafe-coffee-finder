## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

This project uses custom Google Fonts.

## Setup Local Environment with Coffee Stores

You need to setup a few API keys for this project to be setup correctly otherwise you won't see any coffee stores.

- [Foursquare API Key](https://developer.foursquare.com/docs/migrate-to-newest-places-api-version#generating-api-keys)
- [Unsplash Access Key](https://unsplash.com/documentation)
- [Airtable Base and API Key](https://www.airtable.com/api)

For that, you can create a .env.local file in your project as [shown in docs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) that will look like this:

```
AIRTABLE_BASE_KEY=<REPLACE THIS>
AIRTABLE_API_KEY=<REPLACE THIS>
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<REPLACE THIS>
NEXT_PUBLIC_FOURSQUARE_API_KEY=<REPLACE THIS>
```

## Deploy on Vercel

This project is deployed on vercel. Checkout [https://cafe-coffee-finder.vercel.app/](https://cafe-coffee-finder.vercel.app/).

\*\*Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
