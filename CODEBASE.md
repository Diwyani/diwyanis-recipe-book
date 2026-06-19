# Diwyani's Recipe Book — Codebase Guide

A personal recipe collection website built with Next.js 16, Supabase, and Tailwind CSS v4. This document explains every file, how the system fits together, and what you need to know to work on it.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Data Architecture](#data-architecture)
5. [Page Architecture](#page-architecture)
6. [Component Guide](#component-guide)
7. [Styling System](#styling-system)
8. [External Data Sources](#external-data-sources)
9. [Special States](#special-states)
10. [Public Assets](#public-assets)
11. [Things to Remove Before Launch](#things-to-remove-before-launch)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | Framework — App Router, server components, image optimisation |
| React | 19 | UI library |
| TypeScript | 5 | Type safety across all files |
| Tailwind CSS | v4 | Utility-first styling (no config file needed in v4) |
| Supabase | 2.x | Postgres database — stores recipes and pantry items |
| `@supabase/supabase-js` | 2.x | Supabase JavaScript client |

---

## Project Structure

```
diwyanis-recipe-book/
│
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root HTML shell, fonts, metadata
│   ├── page.tsx                  # Homepage (server component)
│   ├── loading.tsx               # Loading screen shown before page renders
│   ├── not-found.tsx             # 404 page
│   ├── globals.css               # Global styles, Tailwind theme, keyframes
│   └── loading-preview/
│       └── page.tsx              # Dev-only route to preview the loading screen
│
├── components/                   # Reusable UI components
│   ├── PolaroidStack.tsx         # Decorative polaroid + pantry card widget
│   ├── RecipeGrid.tsx            # Filterable recipe card grid
│   ├── RecipeModal.tsx           # Full recipe detail modal
│   ├── SubstackSection.tsx       # Footer: social links + Substack posts
│   ├── supabase.ts               # Supabase client (used by client components)
│   └── pantry-data.ts            # Static fallback pantry data (unused at runtime)
│
├── lib/                          # Shared utilities
│   ├── types.ts                  # TypeScript type definitions
│   ├── supabase.ts               # Supabase client (used by server components)
│   └── substack.ts               # Substack RSS fetcher + post type
│
├── public/                       # Static files served at /
│   ├── loading1.png              # Loading animation frame 1
│   ├── loading2.png              # Loading animation frame 2
│   ├── loading3.png              # Loading animation frame 3
│   ├── 404.png                   # 404 page illustration (add this file)
│   ├── profile.png               # Footer profile photo
│   ├── polaroid-photo-1.webp     # Polaroid widget — top photo
│   ├── polaroid-photo-2.webp     # Polaroid widget — bottom photo
│   ├── Arrow.svg                 # Arrow icon used on recipe cards and posts
│   └── salt-cursor.svg           # Custom cursor (defined but not wired yet)
│
├── next.config.ts                # Next.js config — allowed image domains
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config
└── .env.local                    # Secret keys (never commit this file)
```

---

## Environment Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

This file must exist at the project root. It is **never committed to git** (`.gitignore` excludes it).

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values come from your Supabase project dashboard under **Settings → API**.

### 3. Run locally

```bash
npm run dev       # starts at http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint      # run ESLint
```

---

## Data Architecture

### Supabase Database

There are two tables in Supabase.

---

#### `recipes` table

This is the main content table. Each row is one recipe.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `title` | text | Recipe name, displayed prominently |
| `slug` | text | URL-friendly version of the title |
| `image_url` | text \| null | Full URL to the recipe photo (hosted in Supabase Storage) |
| `category` | text \| null | One of: `breakfast`, `dinner`, `snack` |
| `time_minutes` | int \| null | Cook time, shown as a pill |
| `cost_inr` | int \| null | Approximate cost in Indian Rupees |
| `calories` | int \| null | Calorie count |
| `ingredients` | jsonb \| null | Array of `{ name: string, image: string \| null }` objects |
| `instructions` | text \| null | Full method, stored as plain text with line breaks |
| `display_order` | int | Controls the order recipes appear in the grid (lower = first) |

**To reorder recipes:** Update the `display_order` column directly in Supabase. The query fetches rows with `.order("display_order", { ascending: true })`, so the lowest number appears first.

**To add a recipe:** Insert a new row in Supabase. Images should be uploaded to Supabase Storage and the public URL pasted into `image_url`.

---

#### `pantry` table

Used by the decorative PolaroidStack widget on the homepage.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `item_name` | text | Name of the ingredient |
| `type` | text | Either `"restock"` or `"leftover"` |
| `quantity` | text \| null | Optional amount, e.g. `"2kg"`, `"1/2"` |

---

### Two Supabase Clients

There are two files that create a Supabase client — this is intentional:

- **`lib/supabase.ts`** — used by server components (runs only on the server, during page render)
- **`components/supabase.ts`** — used by client components like `PolaroidStack.tsx` that fetch data in the browser

Both use the same environment variables. They exist separately to keep the import paths clean and avoid accidentally importing server-side code into a client bundle.

---

### Caching

The recipe fetch in `app/page.tsx` is wrapped in `unstable_cache` from `next/cache`:

```ts
const fetchRecipes = unstable_cache(
  async () => { /* Supabase query */ },
  ["recipes"],
  { revalidate: 3600 } // cache for 1 hour
);
```

This means after the first page load, Supabase is not queried again for 60 minutes. The cache key is `["recipes"]`. To force a fresh fetch during development, restart the dev server.

The Substack RSS feed is also cached for 1 hour via Next.js `fetch` options:
```ts
fetch(FEED_URL, { next: { revalidate: 3600 } })
```

---

## Page Architecture

### How Next.js App Router works here

The App Router treats every file in `app/` as a route. Files named `page.tsx` are the page content. Special filenames like `loading.tsx` and `not-found.tsx` are automatically used by the framework.

```
app/page.tsx           →  renders at /
app/loading.tsx        →  shown at / while page.tsx is fetching data
app/not-found.tsx      →  shown when any URL doesn't match a route
app/loading-preview/   →  renders at /loading-preview (dev only)
```

### Server vs Client components

By default, every component in the App Router is a **server component** — it runs only on the server at request time, never in the browser.

Adding `"use client"` at the top of a file makes it a **client component** — it runs in the browser and can use `useState`, `useEffect`, and browser APIs.

In this project:

| File | Type | Reason |
|---|---|---|
| `app/page.tsx` | Server | Fetches recipes from Supabase at request time |
| `app/layout.tsx` | Server | Static shell, no interactivity needed |
| `app/loading.tsx` | Server | Pure display, no state |
| `app/not-found.tsx` | Server | Pure display |
| `components/RecipeGrid.tsx` | Client | Needs `useState` for search/filter/modal |
| `components/RecipeModal.tsx` | Client | Needs `useState`, keyboard events, portal |
| `components/PolaroidStack.tsx` | Client | Needs hover state + Supabase fetch for pantry |
| `components/SubstackSection.tsx` | Server | No interactivity, receives data as props |

### Data flow on homepage load

```
Browser requests /
    ↓
Next.js shows loading.tsx (loading animation plays)
    ↓
app/page.tsx runs on server:
    → fetchRecipes()       hits Supabase (or returns from cache)
    → fetchSubstackPosts() hits Substack RSS (or returns from cache)
    → delay(4500)          artificial wait so loading screen plays ← REMOVE BEFORE LAUNCH
    ↓
Page renders with data and is sent to browser
    ↓
React hydrates the client components (RecipeGrid, PolaroidStack)
    ↓
PolaroidStack independently fetches pantry data from Supabase in the browser
```

---

## Component Guide

### `app/layout.tsx`

The root shell that wraps every page. It:
- Loads two Google Fonts via `next/font/google`: **Barrio** (display headings) and **Syne** (all body text)
- Sets the page `<title>` and `<meta description>`
- Applies the font CSS variables to the `<html>` element

You don't need to touch this file unless you're adding a new font or changing SEO metadata.

---

### `app/page.tsx` — Homepage

A server component. It:
1. Calls `fetchRecipes()` (cached Supabase query)
2. Calls `fetchSubstackPosts()` (cached RSS fetch)
3. Passes the results down as props to child components

The page layout uses a CSS grid header with two columns on desktop: the text block on the left, the PolaroidStack on the right. On mobile it stacks vertically and the PolaroidStack is hidden (`hidden md:block`).

---

### `components/RecipeGrid.tsx`

A client component. Receives `initialRecipes` (the full recipe array) as a prop and handles everything from there in the browser.

**Search:** filters recipes by title using a text input. Case-insensitive, matches anywhere in the title.

**Category filter:** buttons for `all`, `breakfast`, `dinner`, `snack`. These filter by the `category` field.

**Both filters work together** — search and category can be combined.

**RecipeCard** (internal component): renders differently on mobile vs desktop:
- **Mobile:** horizontal row — square image on the left, title + meta on the right
- **Desktop:** vertical card — square image on top, title + meta below

Clicking a card sets `selectedRecipe` in state, which renders the `RecipeModal`.

**WhyBlock** (internal component): a small decorative text block that renders as the last item in the grid, explaining the philosophy behind the project.

---

### `components/RecipeModal.tsx`

A client component that renders via `createPortal` directly into `document.body`, so it sits above everything else regardless of z-index stacking contexts.

**Structure on mobile:**
- Category stamp (e.g. "breakfast")
- Title
- Ingredients list
- Dashed divider
- Meta pills (time / cost / calories)
- Method (instructions)

**Structure on desktop (sm: breakpoint and up):**
- Category stamp
- Title + Ingredients side by side (top row)
- Dashed divider
- Large photo + meta pills (left) / Method (right) — bottom row

**Torn-edge effect:** An SVG `<filter>` using `feTurbulence` and `feDisplacementMap` is applied to the navy background div only. The content sits in a separate layer above it. The outer card wrapper uses `overflow-hidden` so the displaced background never bleeds outside the card.

**Scrolling:** the outer card has `overflow-hidden`; an inner div has `max-h-[90vh] overflow-y-auto`. This means the card never grows taller than 90% of the screen, and content scrolls inside it.

**Keyboard:** pressing `Escape` closes the modal.

**Body scroll lock:** while the modal is open, `document.body.style.overflow = "hidden"` prevents the page behind from scrolling.

---

### `components/PolaroidStack.tsx`

A client component. Decorative widget visible only on desktop (`hidden md:block`).

**Two polaroids stacked:**
- **PolaroidPhotos** (front, z-20): two stacked photos, rotated `+7deg`. Photos are grayscale by default and colour on hover.
- **PolaroidPantry** (back, z-10): shows live pantry data from Supabase split into "Restock!" and "Left overs" sections. Rotated `-8deg`.

**Hover interaction:**
- After 620ms of hovering, the pantry card raises (`-translate-y-6`) and comes to the front (z-30), revealing its contents.
- The `pantry-hint` CSS animation (defined in `globals.css`) makes the pantry card gently bob before the user hovers, drawing attention to it.

**Decorative labels:**
- "Joy of Hosting" — positioned to the left of the polaroid stack with a curved arrow SVG pointing right
- "Still Warm" — positioned to the right with a curved arrow SVG pointing left

**Pantry data** is fetched live from the Supabase `pantry` table when the component mounts in the browser.

---

### `components/SubstackSection.tsx`

A server component (no `"use client"`). Receives `posts` as a prop from the homepage.

**Left column:** profile photo + social links (Substack, Instagram, YouTube, Email).

**Right column:** "On Substack" heading + up to 2 post cards + short bio paragraph.

**Which posts show:** The `fetchSubstackPosts` function in `lib/substack.ts` always picks:
1. The **latest** post from the RSS feed
2. A **pinned** specific post — currently hardcoded as `PINNED_SECOND_POST_LINK` (the murder mystery post). Change this constant in `lib/substack.ts` to pin a different post.

**Dev preview buttons** (currently commented out): a block of two pill links that let you navigate to `/loading-preview` and a non-existent URL to test the 404 page. Uncomment them during development, remove before launch.

---

### `lib/substack.ts`

Fetches the Supabase RSS feed (`https://diwyanivajpayee.substack.com/feed`) and parses the XML manually without any external library.

`fetchSubstackPosts(limit = 2)` returns an array of `SubstackPost` objects:
```ts
type SubstackPost = {
  title: string;
  subtitle: string;
  link: string;
  image: string | null; // from <enclosure> tag
}
```

The `decodeEntities` helper converts HTML entities (`&amp;`, `&#8217;`, etc.) to plain characters.

---

### `app/loading.tsx`

Shown automatically by Next.js while `app/page.tsx` is fetching its data.

Displays 3 PNG frames (`/loading1.png`, `/loading2.png`, `/loading3.png`) cycling in a loop using CSS animation with `steps(1)` timing (hard flip, no crossfade). Each frame shows for 1 second, completing a full loop every 3 seconds.

Below the animation, "Diwyani's Recipe Book" is shown in small Syne uppercase text.

**To change speed:** edit `const CYCLE = 3` at the top of the file.

**To add/change frames:** update the `FRAMES` array and drop the corresponding PNGs into `/public/`.

---

### `app/not-found.tsx`

Shown automatically by Next.js when a URL doesn't match any route.

Displays a centred illustration (`/public/404.png`) with a "Page not found" heading and a "Back to recipes" button. Drop your illustration PNG into `/public/404.png` to activate it.

---

## Styling System

### Tailwind CSS v4

This project uses **Tailwind v4**, which works differently from v3:
- No `tailwind.config.js` file — theme is configured directly in `globals.css`
- Custom tokens are defined under `@theme inline { ... }`

### Custom design tokens

Defined in `app/globals.css`:

```css
@theme inline {
  --font-sans: var(--font-syne);
  --color-recipe-yellow: #ffe555;  /* bright yellow — page background */
  --color-recipe-navy: #281a7c;    /* deep purple-navy — text and accents */
}
```

Use these in Tailwind classes: `bg-recipe-yellow`, `text-recipe-navy`, `border-recipe-navy/30` (30% opacity).

### Fonts

| Font | CSS variable | Tailwind class | Used for |
|---|---|---|---|
| Barrio | `--font-barrio` | `font-barrio` | "Recipe Book" heading only |
| Syne | `--font-syne` | `font-syne` | All other text |

### Custom animations (defined in globals.css)

| Name | Class | Used in |
|---|---|---|
| Modal entrance | `animate-modalIn` | RecipeModal outer card |
| Backdrop fade | `animate-fadeIn` | RecipeModal backdrop |
| Pantry hint bob | `pantry-hint` | PolaroidStack pantry card |

### Special CSS classes

| Class | Effect |
|---|---|
| `.paper-grain` | Adds a subtle noise texture via SVG `::after` pseudo-element |
| `.font-barrio` | Applies Barrio font family |
| `.font-syne` | Applies Syne font family |

---

## External Data Sources

### Supabase (database)

- **URL:** stored in `NEXT_PUBLIC_SUPABASE_URL`
- **Used for:** recipes (server-side, cached), pantry items (client-side, live)
- **Image hosting:** recipe photos are uploaded to Supabase Storage. The `hostname` is allowlisted in `next.config.ts` so Next.js can optimise them.

### Substack (RSS)

- **Feed URL:** `https://diwyanivajpayee.substack.com/feed`
- **Used for:** the "On Substack" section at the bottom of the page
- **No API key needed** — the RSS feed is public
- **Cached** for 1 hour via `fetch` revalidation

### Google Fonts

- Loaded at build time via `next/font/google` in `app/layout.tsx`
- Fonts are self-hosted by Next.js after the first build — no runtime Google DNS lookup

---

## Special States

### Loading screen (`app/loading.tsx`)

Next.js automatically shows this file while the server is fetching data for `app/page.tsx`. It renders on the yellow background with a looping PNG animation and small text below.

**Note:** There is currently an artificial `delay(4500)` in `app/page.tsx` that keeps the loading screen visible for at least 4.5 seconds so the animation has time to play. **Remove this before launch** — it makes every page load 4.5 seconds slower.

### 404 page (`app/not-found.tsx`)

Triggered automatically for any URL that doesn't match a defined route. To test it, click "Preview 404" in the footer (dev buttons) or navigate to `/this-page-does-not-exist`.

### Dev preview route (`app/loading-preview/page.tsx`)

A route that simply renders the `Loading` component directly, so you can visit `/loading-preview` in your browser to see the loading animation without waiting for a slow fetch. Safe to delete before launch.

---

## Public Assets

All files in `/public/` are served at the root URL (`/filename`).

| File | Used by | Notes |
|---|---|---|
| `loading1.png` | `app/loading.tsx` | Frame 1 of loading animation |
| `loading2.png` | `app/loading.tsx` | Frame 2 of loading animation |
| `loading3.png` | `app/loading.tsx` | Frame 3 of loading animation |
| `404.png` | `app/not-found.tsx` | 404 illustration — add this file |
| `profile.png` | `SubstackSection.tsx` | Footer circular profile photo |
| `polaroid-photo-1.webp` | `PolaroidStack.tsx` | Top photo in polaroid widget |
| `polaroid-photo-2.webp` | `PolaroidStack.tsx` | Bottom photo in polaroid widget |
| `Arrow.svg` | `RecipeGrid.tsx`, `SubstackSection.tsx` | Arrow icon on cards |
| `salt-cursor.svg` | Not yet wired | Intended custom cursor |

---

## Things to Remove Before Launch

These are deliberately left in for development and testing. Remove them before publishing the site publicly.

1. **Artificial page delay** — in `app/page.tsx`, delete these two lines:
   ```ts
   const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
   // and inside Promise.all:
   delay(4500),
   ```

2. **Dev preview route** — delete the entire `app/loading-preview/` folder.

3. **Dev preview buttons** — in `components/SubstackSection.tsx`, the commented-out block labelled `Dev preview buttons` can be fully deleted.

---

## Adding a New Recipe

1. Go to your Supabase dashboard → Table Editor → `recipes`
2. Insert a new row with the recipe details
3. Upload the photo to Supabase Storage → copy the public URL into `image_url`
4. Set `display_order` to control where it appears in the grid (lower number = appears first)
5. The site will pick it up automatically on next page load (or within 1 hour from cache)

## Pinning a Different Substack Post

Open `lib/substack.ts` and update the constant:

```ts
export const PINNED_SECOND_POST_LINK =
  "https://diwyanivajpayee.substack.com/p/your-post-slug-here";
```

The second card in the "On Substack" section will always show this post.
