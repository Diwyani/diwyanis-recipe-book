# Frontend Concepts — Diwyani's Recipe Book

Every concept from the IA list mapped to this codebase specifically.

---

## 15 Core Front-End Concepts

### 1. Critical Rendering Path
The browser parses HTML → builds DOM → parses CSS → builds CSSOM → combines them into a Render Tree → layouts → paints pixels.

**In this site:** Next.js controls this tightly. `app/layout.tsx` loads Barrio + Syne via `next/font/google`, which injects `<link rel="preload">` tags into the `<head>` so fonts don't block rendering. The yellow background on `html, body` in `globals.css` means the very first paint is already yellow — no white flash before CSS loads.

---

### 2. Core Web Vitals

- **LCP (Largest Contentful Paint):** The biggest visible element loading fast. On this site it's likely the "Recipe Book" `<h1>` or the PolaroidStack images. The `priority` prop on `polaroid-photo-1.webp` and `polaroid-photo-2.webp` in `PolaroidStack.tsx` tells Next.js to inject `<link rel="preload">` for those images — directly improving LCP.

- **CLS (Cumulative Layout Shift):** Layout jumping as things load. The `aspect-[4/5]` on polaroid slots and fixed `w-52 h-52` on recipe card images reserve space before images arrive — zero layout shift.

- **INP (Interaction to Next Paint):** How fast the page responds to clicks. The `clicking` state bounce animation in `RecipeCard` gives immediate visual feedback on click before the modal even opens, making INP feel instant even if JS is still processing.

---

### 3. HTTP Caching

**In this site:** `unstable_cache` in `app/page.tsx`:

```ts
const fetchRecipes = unstable_cache(
  async () => { /* supabase query */ },
  ["recipes"],
  { revalidate: 3600 }
);
```

This caches the Supabase response on the **server** for 1 hour. Subsequent visitors within that hour get the same data without hitting Supabase — like a TTL cache. Same pattern applies to `fetchSubstackPosts` which passes `{ next: { revalidate: 3600 } }` directly to `fetch()`.

---

### 4. Content Negotiation
The client tells the server "I accept gzip/brotli" via `Accept-Encoding` headers; the server sends compressed responses.

**In this site:** Next.js handles this automatically — it gzip/brotli compresses all JS bundles and HTML responses. More visibly: the `<Image>` component in `RecipeGrid.tsx` and `PolaroidStack.tsx` uses Next.js's image optimizer, which reads the request's `Accept` header and serves **WebP** to browsers that support it, falling back to JPEG — that's content negotiation at the image level.

---

### 5. Lazy Loading
Deferring asset loading until needed.

**In this site:** Recipe card images in `RecipeGrid.tsx`:

```tsx
<Image loading="lazy" ... />
```

Images below the fold don't download until the user scrolls near them. The `preload()` function on hover/touch pre-fetches the full-size modal image before the user clicks — bridging lazy loading and instant modal appearance:

```ts
function preload() {
  if (recipe.image_url) {
    const img = new window.Image();
    img.src = recipe.image_url;
  }
}
```

---

### 6. Bundle Splitting
Next.js App Router does this automatically. Every `"use client"` boundary creates a split point.

**In this site:**

| File | Type | JS shipped to client |
|------|------|----------------------|
| `app/page.tsx` | Server | None |
| `RecipeGrid.tsx` | Client | Yes — search, filter, modal state |
| `RecipeModal.tsx` | Client | Yes — portal, keyboard handler |
| `PolaroidStack.tsx` | Client | Yes — hover animation, Supabase realtime |
| `SubstackSection.tsx` | Server | None |

Users load only the JS for interactive components. The static bio, "On Substack" heading, and post cards ship as pure HTML.

---

### 7. Critical CSS
Tailwind + Next.js inline only the CSS needed for the initial render into `<style>` tags in `<head>`. Everything below the fold is deferred. The `paper-grain` class and `@keyframes` animations in `globals.css` are bundled but the browser parses them non-blocking after the initial paint.

---

### 8. Essential State
Keeping state minimal to avoid unnecessary re-renders.

**In this site:** `RecipeGrid.tsx` manages only three state variables:

```ts
const [query, setQuery] = useState("");
const [activeCategory, setActiveCategory] = useState("all");
const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
```

The filtered recipe list is **derived** via `useMemo` — it's not stored as state. This is essential state: minimum data, maximum derivation.

---

### 9. The Reducer Pattern
Not explicitly used here, but `useMemo` with `query` + `activeCategory` + `initialRecipes` as inputs is the same idea — a pure function that computes output from inputs deterministically, no side effects.

---

### 10. Windowing / List Virtualization
**Not used here** — the recipe list is short enough that all cards can be in the DOM at once. Worth adding if recipes ever exceed ~100.

---

### 11. Server-Side Rendering (SSR)
Doing data fetching and HTML generation on the server.

**In this site:** `app/page.tsx` is an `async` server component:

```ts
export const dynamic = "force-dynamic";

export default async function Home() {
  const [recipes, substackPosts] = await Promise.all([
    fetchRecipes(),
    fetchSubstackPosts(),
    delay(4500),
  ]);
  return <main>...</main>;
}
```

The HTML that reaches the browser already contains all recipe titles, meta pills, and Substack post data. No spinner, no empty shell — content-first.

---

### 12. Rehydration
After SSR HTML arrives, React downloads the client JS bundles and "wakes up" the static HTML — attaching event listeners, initialising state.

**In this site:** The `<RecipeGrid>` arrives as static HTML (recipe cards visible immediately), then React hydrates it — after which clicking a card triggers `setSelectedRecipe` and the modal appears. The `"use client"` directive marks exactly which components need hydration.

---

### 13. Partial Pre-Rendering
Mixing static server output with dynamic client islands on the same page.

**This entire site is partial pre-rendering:**

| Section | Rendering | JS shipped |
|---------|-----------|------------|
| Hero + heading | Static server HTML | None |
| `<SubstackSection>` | Static server HTML | None |
| `<RecipeGrid>` | Hydrated client island | Yes |
| `<PolaroidStack>` | Hydrated client island | Yes |

---

### 14. Server Components
React components that render on the server and ship zero JavaScript.

**In this site:**
- `app/page.tsx` — fetches from Supabase, renders layout, no JS shipped
- `SubstackSection.tsx` — no `"use client"`, renders post cards as pure HTML

Compare to `RecipeGrid.tsx` which has `"use client"` at the top — that one ships JS. `SubstackSection` doesn't need interactivity so it stays server-only.

---

### 15. Micro Frontends
**Not used here** — the site is a single Next.js app. Relevant at org scale (multiple teams, separate deployments).

---

## React Concepts

### Components
Every visual piece is a component. The hierarchy:

```
Home (server)
├── Nav
├── PolaroidStack (client)
│   ├── PolaroidPhotos
│   └── PolaroidPantry
├── RecipeGrid (client)
│   ├── RecipeCard (×n)
│   ├── WhyBlock
│   └── RecipeModal (portal → body)
│       └── CloseButton
└── SubstackSection (server)
```

---

### JSX
Every `.tsx` file uses JSX. Examples from this site:

```tsx
// className not class (camelCase)
<div className="font-barrio text-3xl uppercase">

// Dynamic JS injected with {}
<h2 style={{ fontSize: recipe.title.length > 20 ? "clamp(1.75rem...)" : "clamp(2.5rem...)" }}>
  {recipe.title}
</h2>

// Conditional rendering with ternary
{recipe.image_url ? <Image src={recipe.image_url} /> : <div className="placeholder" />}

// Short-circuit rendering
{recipe.category && <span>{recipe.category}</span>}
```

---

### React Fragment
Used in `RecipeModal.tsx`:

```tsx
return createPortal(
  <>
    {/* Fragment wraps SVG filter + backdrop without adding a DOM node */}
    <svg>...</svg>
    <div className="fixed inset-0 ...">...</div>
  </>,
  document.body
);
```

---

### Props
Data flows down from parent to child:

```
Home → recipes[]        → RecipeGrid
RecipeGrid → recipe     → RecipeCard
RecipeCard → onClick    → triggers setSelectedRecipe
RecipeGrid → recipe     → RecipeModal
RecipeModal → onClose   → CloseButton
```

---

### Children Prop
Not explicitly used in this codebase — layout composition is done through direct JSX nesting rather than slot-style children passing.

---

### Key Prop

```tsx
{recipes.map((recipe, i) => (
  <RecipeCard key={recipe.id} ... />   // recipe.id as key
))}

{SOCIAL_LINKS.map((link) => (
  <a key={link.label} ...>             // label as key
))}
```

React uses `key` to know which card to re-render when the filter changes, instead of rebuilding the whole list.

---

### Virtual DOM and Reconciliation
When you type in the search box, `setQuery` triggers a re-render. `useMemo` recomputes the filtered list. React diffs the old virtual DOM (all recipe cards) against the new one (filtered cards) and only removes/adds the changed `<article>` elements from the real DOM — it doesn't repaint everything.

---

### Event Handling

```tsx
// Click
<button onClick={handleClick}>

// Keyboard — RecipeModal.tsx
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") onClose();
});

// Hover
<div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>

// Touch (for mobile image preloading)
<button onTouchStart={preload}>

// Controlled input
<input onChange={(e) => setQuery(e.target.value)}>
```

---

### Controlled Components
The search input in `RecipeGrid.tsx`:

```tsx
<input
  value={query}                              // React owns the value
  onChange={(e) => setQuery(e.target.value)} // updates state on every keystroke
/>
```

React state IS the source of truth. The input can never show anything that isn't in `query`.

---

### Hooks

**`useState`** — local mutable state:

```ts
// RecipeGrid
const [query, setQuery] = useState("");
const [activeCategory, setActiveCategory] = useState("all");
const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

// RecipeCard
const [clicking, setClicking] = useState(false);

// PolaroidStack
const [hovered, setHovered] = useState(false);
const [pantryRaised, setPantryRaised] = useState(false);
const [pantryOnTop, setPantryOnTop] = useState(false);
const [restockItems, setRestockItems] = useState<PantryItem[]>([]);
const [leftoverItems, setLeftoverItems] = useState<PantryItem[]>([]);
```

**`useEffect`** — side effects (DOM, timers, subscriptions):

```ts
// RecipeModal — lock body scroll while modal is open
useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = ""; }; // cleanup on unmount
}, []);

// RecipeModal — keyboard listener
useEffect(() => {
  document.addEventListener("keydown", handleKey);
  return () => document.removeEventListener("keydown", handleKey); // cleanup
}, [onClose]);

// PolaroidStack — fetch pantry from Supabase on mount
useEffect(() => {
  fetchPantry();
}, []); // empty array = run once after first render

// PolaroidStack — cleanup timers on unmount
useEffect(() => {
  return () => {
    if (raiseTimer.current) clearTimeout(raiseTimer.current);
    if (zTimer.current) clearTimeout(zTimer.current);
  };
}, []);
```

**`useMemo`** — memoised derived values:

```ts
// RecipeGrid — recompute filtered list only when inputs change
const recipes = useMemo(() => {
  let list = initialRecipes;
  if (query.trim()) list = list.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
  if (activeCategory !== "all") list = list.filter(r => r.category === activeCategory);
  return list;
}, [initialRecipes, query, activeCategory]);
```

Without `useMemo`, this filter runs on every render — including renders caused by the `clicking` animation state, which has nothing to do with the recipe list.

**`useRef`** — mutable value that doesn't trigger re-renders:

```ts
// PolaroidStack — store timer IDs so they can be cleared on mouse leave
const raiseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const zTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// Usage
raiseTimer.current = setTimeout(() => setPantryRaised(true), 620);
// Later:
if (raiseTimer.current) clearTimeout(raiseTimer.current);
```

If these were `useState`, updating them would trigger a re-render. `useRef` stores the value silently.

---

### Component Purity

`imageAdjust(title)` in `RecipeGrid.tsx` is a pure function — same input always returns same output, no side effects. `timeLevel`, `costLevel`, `calorieLevel` in `lib/levels.ts` are all pure:

```ts
export function timeLevel(minutes: number | null): string | null {
  if (minutes == null) return null;
  if (minutes <= 15) return "Low";
  if (minutes <= 30) return "Medium";
  return "High";
}
```

React requires component render functions to be pure for reconciliation to work correctly.

---

### Effects
`PolaroidStack.tsx` uses an effect to reach outside React and call Supabase:

```ts
useEffect(() => {
  async function fetchPantry() {
    const { data, error } = await supabase.from("pantry").select("*");
    if (error) return;
    setRestockItems(data.filter(i => i.type === "restock"));
    setLeftoverItems(data.filter(i => i.type === "leftover"));
  }
  fetchPantry();
}, []);
```

This runs after the component mounts — React has painted the polaroid first, then data loads in.

---

### Refs

```ts
// PolaroidStack — holds timer references across renders without causing re-renders
const raiseTimer = useRef(null);
raiseTimer.current = setTimeout(() => setPantryRaised(true), 620);
if (raiseTimer.current) clearTimeout(raiseTimer.current);
```

If these were `useState`, clearing the timer would trigger a re-render loop.

---

### Context
**Not used here** — the component tree is shallow enough that props pass directly. If the site grew (e.g., a global "theme" or "user preferences"), Context would replace prop drilling.

---

### Portals
`RecipeModal.tsx` renders into `document.body`, outside the normal component tree:

```tsx
return createPortal(
  <div className="fixed inset-0 z-50 ...">...</div>,
  document.body
);
```

**Why?** The modal needs `z-index` stacking above everything, including the `<header>` and `<PolaroidStack>`. If it rendered inside `<RecipeGrid>`, a parent's `overflow: hidden` or `transform` could clip or trap it. Portals escape that entirely.

---

### Suspense
**Not explicitly used** — Next.js handles loading states via the loading screen component. If a `<Suspense>` boundary were added around `<RecipeGrid>`, a skeleton would show while the server fetches recipes. The `delay(4500)` in `page.tsx` is currently doing a manual version of this via the animated loading screen.

---

### Error Boundaries
**Not explicitly used.** If Supabase fails, `fetchRecipes` returns `[]` (empty array) and the grid shows "Nothing here yet." — a manual fallback rather than a React Error Boundary component. The Substack fetch similarly returns `[]` on any network error.

---

## API Calls

| Call | Where | How |
|------|--------|-----|
| Supabase recipes | `app/page.tsx` (server) | `supabase.from("recipes").select(...)` |
| Substack RSS | `lib/substack.ts` (server) | `fetch(FEED_URL)` + XML parsing |
| Supabase pantry | `PolaroidStack.tsx` (client) | `supabase.from("pantry").select("*")` |

The first two happen **before** any HTML is sent to the browser. The pantry fetch happens **after** the page loads, client-side, because it's realtime and personal to the user viewing the polaroid.

---

## Data Flow Summary

```
Supabase DB
    │
    ▼ (server, cached 1hr)
app/page.tsx  ──────────────────────────────────────────┐
    │                                                   │
    ▼ props                                             ▼ props
RecipeGrid (client)                            SubstackSection (server → HTML)
    │
    ├── useMemo → filtered recipes
    ├── useState → selectedRecipe
    │
    ▼ onClick
RecipeModal (portal → body)
    │
    ├── useEffect → lock scroll
    └── useEffect → keyboard listener


PolaroidStack (client)
    │
    ├── useEffect → fetch pantry (Supabase, client-side)
    ├── useState → hovered, pantryRaised, items
    └── useRef → timer IDs
```
