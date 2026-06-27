# Property Lords — Website

A React (Vite) + Tailwind v4 real estate site with built-in lead capture wired
to Follow Up Boss, an interactive mortgage calculator, and a listings section
that auto-hides until you add real inventory.

> This project (`property-lords-site`) is the public website. There's a
> separate sibling project, `property-lords-dashboard`, that gives you a
> form-based editor for this site's content — see its own README. Both are
> meant to sit next to each other on disk, e.g.:
> ```
> property-lords/
>   property-lords-site/        ← this project
>   property-lords-dashboard/   ← the content editor
> ```

> All editable content (business info, listings, bio, testimonials) lives in
> `content/site-content.json`. You can edit that file directly, or use the
> companion **dashboard app** (separate project, own README) for a form-based
> editor with photo uploads and one-click publish.

## Stack

- **React 19 + Vite** — frontend
- **Tailwind CSS v4** — styling (theme tokens live in `src/index.css`, no `tailwind.config.js` needed)
- **Vercel serverless function** (`api/lead.js`) — receives form submissions and forwards them to Follow Up Boss server-side, so your API key never reaches the browser
- **lucide-react** — icons (note: this version dropped brand/social icons; Instagram/LinkedIn/Facebook icons in `Footer.jsx` are small inline SVGs instead)

## How it works

### Page composition

`src/App.jsx` is the entire page — it just stacks sections in order:
`Navbar → Hero → ProcessSteps → Listings → About → Testimonials → Contact → Footer`.
There's no router; this is a single scrolling page, and the nav links
(`#listings`, `#calculator`, etc.) are anchor links to `id`s on each
`<section>`. Reordering the page means reordering the children in
`App.jsx` — nothing else needs to change.

Every section pulls its content from `src/data/siteConfig.js`, `listings.js`,
`about.js`, or `testimonials.js`. Each of those is a **thin re-export** —
the real content lives in one file, `content/site-content.json`, and the
`src/data/*.js` files just import a slice of it (see "Content storage"
below). No copy is hardcoded inside component files — that's deliberate, so
editing one JSON file updates the whole site instead of hunting through
JSX.

### Content storage

All editable content — business info, listings, your bio, testimonials —
lives in one file: **`content/site-content.json`**. The files under
`src/data/` are just one-line re-exports that pull a slice out of that
JSON so components can `import { siteConfig } from "../data/siteConfig"`
as normal:

```js
// src/data/siteConfig.js
import content from "../../content/site-content.json";
export const siteConfig = content.siteConfig;
```

You can edit `content/site-content.json` directly by hand — it's just
JSON — or use the companion **dashboard app** (a separate project; see
its own README) which gives you a form-based UI, validates your edits
before saving, handles photo uploads into `public/`, and can commit +
push the change for you so Vercel redeploys automatically. Either way
you're editing the same file; the dashboard is a convenience layer, not a
different system.

### The lead pipeline, end to end

This is the part most worth understanding before you deploy, since it spans
the browser, a serverless function, and a third-party API:

1. **A visitor fills out a form.** There are three forms — the mortgage
   calculator's "email me this estimate" button
   (`MortgageCalculator.jsx`), the "notify me" form in the empty listings
   state (`Listings.jsx`), and the main contact form (`Contact.jsx`, via
   the reusable `LeadForm.jsx`).
2. **Every form calls the same hook.** `src/lib/useLeadSubmit.js` is the
   single chokepoint all three go through. It exposes `submit(payload)`
   plus a `status` (`idle | loading | success | error`) that each form's UI
   reacts to — that's why every form shows the same spinner → success
   checkmark pattern.
3. **The hook POSTs to `/api/lead`** (configured as `leadEndpoint` in
   `siteConfig.js`) with a JSON body: name, email or phone, a `message`,
   a `type` (e.g. `"General Inquiry"`, `"Registration"`), and a `source`
   string identifying which form sent it (e.g. `"mortgage-calculator"`,
   `"listing-alerts"`, `"contact-section"`). This request happens entirely
   in the browser — at this point your Follow Up Boss credentials are not
   involved yet.
4. **`api/lead.js` runs server-side**, never in the browser. This is a
   Vercel serverless function: Vercel automatically turns any file under
   `api/` into its own HTTP endpoint, so a POST to `/api/lead` on your live
   domain invokes this exact file. It reads `FUB_API_KEY`,
   `FUB_SYSTEM_NAME`, and `FUB_SYSTEM_KEY` from environment variables
   (never from the request, never from client code), validates that the
   submission has a name and at least an email or phone, and normalizes
   the `type` against an allow-list so a typo or unexpected value can't
   silently produce an event FUB won't act on.
5. **The function forwards the lead to Follow Up Boss** via
   `POST https://api.followupboss.com/v1/events`, with your system
   credentials in the `Authorization`, `X-System`, and `X-System-Key`
   headers. FUB deduplicates against existing contacts, runs any action
   plans configured for that event type, and notifies you (email/text)
   depending on your FUB settings.
6. **The result flows back.** A `200`/`201` from FUB becomes a `200` from
   `/api/lead`, which resolves the original `submit()` call as success and
   flips the form's `status` to `"success"`. Any failure — missing env
   vars, FUB rejecting the request, a network error — gets caught and
   returned as a `4xx`/`5xx` with an `error` message, which the form
   displays inline instead of failing silently.

The reason this round-trip exists instead of calling Follow Up Boss
directly from the browser: your `FUB_API_KEY` would otherwise be visible to
anyone who opens dev tools on your site, which would expose your entire
CRM. Routing through a serverless function keeps that key on the server
only.

### The listings feature flag

`Listings.jsx` checks `siteConfig.listingsEnabled && listings.length > 0`.
While that's false (the default, since `listings` ships as an empty array
in `content/site-content.json`), the section renders the "notify me"
capture form instead of a property grid. Flip `listingsEnabled` to `true`
and populate `listings` (by hand in the JSON, or via the dashboard) and
the same component switches to rendering `ListingCard` for each entry —
no conditional logic needs to change anywhere else, because the branch
already exists in the component.

### Styling system

Tailwind v4 is configured via the `@tailwindcss/vite` plugin in
`vite.config.js` rather than a `tailwind.config.js` file. All design tokens
(colors, fonts, animations) are declared once in `src/index.css` inside an
`@theme` block — e.g. `--color-clay`, `--font-display` — and from there
they're usable as ordinary Tailwind classes (`bg-clay`, `font-display`)
anywhere in the app. Changing a color site-wide means editing one line in
`index.css`, not find-and-replacing a hex code across components.



```
content/
  site-content.json   ← the real source of truth for all editable content
src/
  data/
    siteConfig.js      ← thin re-export of content.siteConfig
    listings.js         ← thin re-export of content.listings
    about.js             ← thin re-export of content.about
    testimonials.js      ← thin re-export of content.testimonials
  lib/
    useLeadSubmit.js   ← shared hook all forms use to submit leads
  components/          ← Navbar, Footer, LeadForm, MortgageCalculator, ListingCard
  sections/             ← Hero, ProcessSteps, Listings, About, Testimonials, Contact
api/
  lead.js               ← serverless function: forwards leads to Follow Up Boss
vercel.json             ← deployment config
.env.example            ← required environment variables (copy to .env.local)
```

## 1. Local development

```bash
npm install
npm run dev
```

Visit the printed local URL. Forms will fail to submit locally until you set
up environment variables and run via `vercel dev` (see below) — that's
expected, since there's no API route in plain `vite dev`.

To test the API route locally, install the Vercel CLI and run:

```bash
npm install -g vercel
vercel dev
```

## 2. Edit your business info

Either edit `content/site-content.json` directly (it's just JSON — open
the `siteConfig` key and replace name, brokerage, phone, email, social
links, areas served), or run the companion dashboard app and use its
"Business info" page. Everything on the site reads from this one file.

**One exception:** `index.html`'s `<title>` and `<meta name="description">`
tags are plain static HTML, not wired to `siteConfig` — search engines and
browser tabs read these directly, and they currently say "Property Lords"
as a generic placeholder. Edit `index.html` by hand once you know your
final agent name, brokerage, and areas served, so search results and
browser tabs show something accurate.

## 3. Set up Follow Up Boss

Follow Up Boss requires a one-time system registration before you can send
leads in via API — this is separate from your personal FUB login.

1. **Get your API key**: In Follow Up Boss, go to **Admin → API**, generate
   an API key. This is `FUB_API_KEY`.
2. **Register your system**: Go to
   https://docs.followupboss.com/docs/start-here-brand-new-integration and
   register a system name for your website (e.g. `PropertyLordsWebsite`). FUB
   will issue you a **System Key** in response. These become
   `FUB_SYSTEM_NAME` and `FUB_SYSTEM_KEY`.
3. Leads are sent via `POST https://api.followupboss.com/v1/events` — this is
   intentional and required. The `/people` endpoint is deliberately **not**
   used because it skips automations and can create duplicate contacts.
4. Only these event types reliably trigger Follow Up Boss action plans:
   `General Inquiry`, `Property Inquiry`, `Seller Inquiry`, `Registration`,
   `Visited Open House`. Each form in this project already passes one of
   these via its `type` prop — see `api/lead.js` for the allow-list.

### Environment variables

Copy `.env.example` to `.env.local` for local testing, and set the same keys
in **Vercel → Project Settings → Environment Variables** for production:

| Variable | Value |
|---|---|
| `FUB_API_KEY` | Your Follow Up Boss API key |
| `FUB_SYSTEM_NAME` | The system name you registered |
| `FUB_SYSTEM_KEY` | The system key FUB issued you |
| `SITE_DOMAIN` | Your live domain, e.g. `propertylords.com` |

**Never commit real values** — `.env.local` is already covered by
`.gitignore`.

## 4. Deploy to Vercel

Vercel is recommended because it auto-detects Vite, deploys `api/*.js` as
serverless functions with zero config, and connecting a custom domain takes
two steps.

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, sign in, click **Add New → Project**, and import
   the repo. Vercel will detect the Vite framework automatically (this is
   also pinned in `vercel.json`).
3. Before the first deploy (or right after), add the four environment
   variables above under **Project Settings → Environment Variables**, then
   redeploy.
4. Once deployed, go to **Project Settings → Domains**, add your domain
   (e.g. `propertylords.com`), and follow Vercel's instructions to update
   your DNS records at your domain registrar:
   - For an apex domain (`propertylords.com`): add an **A record** pointing
     to the IP Vercel shows you.
   - For a `www` subdomain: add a **CNAME record** pointing to
     `cname.vercel-dns.com`.
   - DNS changes can take a few minutes to a few hours to propagate.
5. Vercel issues a free SSL certificate automatically once DNS verifies.

## 5. Turning on listings

When you have real listings, either use the dashboard's Listings page
(handles photo uploads and validation for you), or edit
`content/site-content.json` by hand. Each listing follows this shape:

```json
{
  "id": "1",
  "address": "123 Maple Grove SW",
  "city": "Calgary, AB",
  "price": 649000,
  "beds": 3,
  "baths": 2,
  "sqft": 1820,
  "image": "/listings/123-maple-grove.jpg",
  "status": "active",
  "description": "Bright bungalow on a quiet cul-de-sac with a finished walkout basement."
}
```

`status` must be one of `"active"`, `"pending"`, or `"sold"`. `id` must be
unique across all listings.

1. Add listing objects to the `listings` array.
2. Set `siteConfig.listingsEnabled` to `true`.
3. If editing by hand, add listing photos under `public/listings/` and
   reference them by path (e.g. `/listings/123-maple-grove.jpg`).

The Listings section automatically switches from the "notify me" empty state
to a real grid of listing cards — no other code changes needed.

If you later connect an MLS/IDX feed, you'd replace the static JSON
`listings` array with a fetch call to your feed's API, ideally cached via a
small serverless function (similar pattern to `api/lead.js`) so your IDX
credentials also stay server-side. At that point the dashboard's Listings
page would no longer apply, since listings would come from the feed
instead of `content/site-content.json`.

## 6. Where each lead-gen feature lives

- **Mortgage calculator** (`src/components/MortgageCalculator.jsx`) — lives in
  the hero, calculates live, and offers to email the estimate (captures a
  lead with type `General Inquiry`).
- **Listing alerts / "notify me"** (`src/sections/Listings.jsx`) — captures
  leads with type `Registration` while you have no live inventory.
- **Contact form** (`src/sections/Contact.jsx`) — general inquiry form, type
  `General Inquiry`.

All three funnel through the same `useLeadSubmit` hook → `api/lead.js` →
Follow Up Boss `/v1/events`.

## Ideas for what to add next

- **Live chat** — Tawk.to or Crisp have a free tier; drop their script tag in
  `index.html`.
- **Neighborhood map** — Google Maps/Mapbox embed showing your service areas.
- **Saved favorites** — once listings are live, let visitors heart properties
  (store in browser state/localStorage, or per-user if you add auth later).
- **Blog/market updates** — good for SEO; could be added as a simple
  Markdown-driven section if you want to stay code-only.
- **Virtual tours** — embed Matterport/YouTube iframes per listing once you
  have them.
