# Canon Motors website

A redesign of [canonmotors.com](https://www.canonmotors.com/), the Mombasa-based importer of Japanese vehicles (est. 2005).
The site focuses on vehicle discovery: server-side search and filtering, full photo galleries, clear specifications and
straightforward enquiries. All business details come from the official site.

This project is connected to [Lovable](https://lovable.dev/projects/ed77f7b3-66ec-46a5-9d01-80f40d2ace26). Commits pushed to
`main` sync back to the Lovable editor — don't force-push or rewrite pushed history.

## Stack

- **TanStack Start** (React 19, file-based routing, SSR, server functions) on **Vite 8**
- **Tailwind CSS 4** with design tokens in `src/styles.css`, **Radix UI** primitives (`src/components/ui`)
- **Zod** for validation, **TanStack Query** for client-side fetching of saved/compared vehicles
- **Vitest** + Testing Library for tests
- Build output: **Nitro**, `cloudflare-module` preset by default (set by `@lovable.dev/vite-tanstack-config`)

## Project structure

```
src/
  data/vehicles.json          Inventory snapshot (100 vehicles, 1,435 photos) — server-only
  server/catalog.ts           Inventory source adapter (server-only; replace to go live)
  server.ts                   Server entry: legacy redirects, security headers, SSR error page
  lib/
    inventory.ts              Pure domain logic: types, filters, sorting, facets, paging, formatting
    inventory.functions.ts    Server functions (RPC): search, detail, by-ids, catalogue summary
    business.ts               Verified contact details, hours, FAQs, fraud notice — edit here
    enquiry.ts                Enquiry validation (Zod) and message composition
    legacy.ts                 Old canonmotors.com URL → new URL mapping
    favourites.ts             Saved + compare lists (browser localStorage)
    process.ts, seo.ts        Buying-process steps, per-page head tags
  components/site/            Header, footer, vehicle card, gallery, filters, enquiry form, …
  routes/                     Pages (see below), plus sitemap.xml and robots.txt
  test/                       Unit, data-integrity and routing tests
```

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, search panel, latest vehicles, categories, makes, why us, process, CTA |
| `/vehicles` | Inventory: search, combinable filters, chips, sort, page size, pagination, mobile drawer |
| `/vehicles/$id` | Detail: gallery + lightbox, specs, availability, enquiry, related vehicles |
| `/makes`, `/categories` | Make → model directory, category directory (live counts) |
| `/how-importing-works`, `/about`, `/contact` | Process & costs, company profile, contact + FAQs |
| `/favourites`, `/compare` | Saved vehicles, side-by-side comparison (this browser only) |
| `/privacy`, `/terms` | Website privacy notice and terms of use |
| `/sitemap.xml`, `/robots.txt` | Generated from the catalogue and `VITE_SITE_URL` |

All filter, sort and page state lives in the URL (`/vehicles?make=Toyota&body=SUV&minYear=2019&sort=mileage&page=2`),
so every search is shareable. Only the current page of results is sent to the browser; the inventory file never ships
in the client bundle (enforced by TanStack Start's import protection on `src/server/**`).

### Legacy URLs (301 redirects)

| Old | New |
| --- | --- |
| `/Kenya/{MAKE MODEL}/{id}` | `/vehicles/{id}` |
| `/Maker/{MAKE}/…` | `/vehicles?make=…` (or `/makes`) |
| `/Model/{MAKE MODEL}/…` | `/vehicles?make=…&model=…` |
| `/index.php?page=N&ipp=M`, `/?Stock=Kenya` | `/vehicles` at the page holding the same records |
| `/about_us/`, `/contact_us/`, `/faqs/` | `/about`, `/contact`, `/contact#faq` |

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev        # http://localhost:8080
npm test           # Vitest
npm run lint       # ESLint + Prettier
npx tsc --noEmit   # type-check
npm run build      # production build → .output/
npm run preview    # serve the production build
```

### Environment variables

Copy `.env.example` to `.env`. Only one variable exists, and it is public (no secrets are used):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://www.canonmotors.com` | Origin for canonical URLs, sitemap, robots, OG tags, structured data |

## Deployment

Publishing from Lovable deploys the `main` branch. For a self-managed deployment, `npm run build` produces a Nitro
`cloudflare-module` bundle in `.output/` (deploy with `npx nitro deploy --prebuilt` or Wrangler). Set `VITE_SITE_URL`
at build time to the production origin.

## Data: what is real and what still needs integrating

**Source.** `src/data/vehicles.json` is a snapshot of 100 listings from the public canonmotors.com pages, with each
vehicle's full photo set (10–19 photos). Reference numbers, specifications and stock locations are as listed. Values the
listing does not state are stored as `null` and shown as "Not provided" — never as zero. Photos are served from the
official image host, which provides 800×600, 400×300 and thumbnail renditions; cards use `srcset` to load the smaller one.

**The live site lists far more vehicles (about 1,000).** The snapshot is a sample. To go live, replace `loadCatalog()` in
`src/server/catalog.ts` with a read from Canon Motors' database or an authorised export/API and map each record to the
`Vehicle` type in `src/lib/inventory.ts`. Nothing else reads the data source. For a large catalogue, move the filtering in
`search()` into the database query; the function signatures can stay the same.

**Not implemented, because the backend or the information is not available:**

- **Prices.** The official site shows "Price: Contact Us", so every vehicle shows "Price on request". Price sorting and
  price filters are deliberately omitted until a price field exists.
- **Enquiry backend.** Forms validate input and hand a pre-filled message (with vehicle title, reference and link) to
  WhatsApp or the visitor's e-mail app; the page says nothing is sent until the visitor presses send. To receive enquiries
  directly, add a `createServerFn` POST handler with server-side Zod validation (reuse `enquirySchema`), rate limiting and
  an e-mail provider or CRM, then switch the form's submit to call it.
- **Admin / inventory management.** No admin system was available in this repository. Inventory is managed on the existing
  canonmotors.com back office; connect it as described above rather than building a disconnected second admin.
- **Customer accounts.** The old site has Register/Login; this site keeps favourites and comparisons in the browser only
  and says so on those pages.
- **Exact office location.** The official site words the street address two ways ("behind Equity Bank" / "Bunju Road"),
  so the site shows "Moi Avenue, Mombasa" and links to a map search instead of an exact pin. Confirm the canonical address
  and update `src/lib/business.ts`.
- **Social links.** None are shown because no official accounts were verified.
- **Hero image.** `src/assets/hero.jpg` is an illustrative image (labelled as such), not Canon Motors stock. Replace it with
  a licensed photo of the business or its yard when available.
- **Legal pages.** `/privacy` and `/terms` describe how this website actually works; have them reviewed before launch.
