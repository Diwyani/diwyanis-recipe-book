# Session Notes — Diwyani's Recipe Book

## What we built / fixed

### Performance
- **Server-side data fetch** — moved Supabase query from a client `useEffect` into an `async` server component in `page.tsx`. Recipes now arrive embedded in the HTML; no loading spinner on first paint.
- **Client-side filtering** — search and category filter now run in memory with `useMemo` instead of re-hitting Supabase on every keystroke. Instant, zero network.
- **Shared type** — extracted `Recipe` type into `lib/types.ts` so `RecipeGrid` and `RecipeModal` can't drift out of sync.

### Animations & Microinteractions
- **Card click** — removed the 320 ms delay that blocked the modal from opening. Card bounce now plays in parallel as pure decoration.
- **Modal entrance** — new `modalIn` keyframe: scales from 0.88, drifts up 24 px, overshoots to 1.02, settles. Uses `cubic-bezier(0.22, 1, 0.36, 1)` spring curve.
- **Backdrop** — separated into its own `backdropIn` fade so it doesn't compete with the card animation.
- **Hover on cards** — shortened from 300 ms `ease-out` to 150 ms `cubic-bezier(0.25, 0.1, 0.25, 1)` (symmetric ease). No more drag on mouse-out.

### Recipe Card Layout
- **Mobile** — redesigned to a horizontal row: large image left (`w-36 h-36`, `rounded-[2.5rem]`), title + arrow + meta icons right.
- **Desktop** — kept vertical card, added time / cost / calories icons below the title to match mobile.
- **Alignment** — fixed `items-start` on mobile row so text pins to the top of the image. Optical `-0.05em` nudge on "Recipe Book" h1 to align with "Diwyani's".

### Salt Shaker Cursor
- Custom navy SVG cursor (`/public/salt-cursor.svg`) applied to the recipe grid section only.
- Cursor reverts to default inside the modal via `cursor: default` on the backdrop.
- `cursor: inherit` on the button inside `RecipeCard` prevents the browser's default hand from overriding the shaker.
- On card click: 22 navy salt grain particles burst from the click point, each with random size (2–6 px), horizontal spread (±60 px), fall distance (90 px), and duration (0.55–0.95 s).

### Modal Fix
- **Portal** — `RecipeModal` now renders via `createPortal` directly into `document.body`, escaping the `overflow-x-clip` on `<main>` that was causing the backdrop to misalign / not cover the full viewport.

### Close Button
- Extracted into its own `CloseButton` component with hover state.
- On hover: flips to navy background + cream `×` (colour inversion).
- Inline style was blocking Tailwind hover classes — state-based approach fixes it.

---

## Key lessons

| Problem | Root cause | Fix |
|---|---|---|
| Slow initial load | Client-side fetch fires after hydration | Fetch on the server, pass as prop |
| Sluggish search | Network request per keystroke | Filter in memory with `useMemo` |
| Modal felt delayed | 320 ms `setTimeout` before `onClick` | Fire `onClick` immediately, animate in parallel |
| Hover feels draggy | `ease-out` has asymmetric deceleration | Use symmetric `ease` curve, shorter duration |
| Hand cursor overrides custom cursor | `cursor-pointer` on `<button>` | `cursor: inherit` lets parent cursor propagate |
| Backdrop misaligned | `overflow-x-clip` on parent creates a containing block for `fixed` in some browsers | `createPortal` to `document.body` |
| Hover colour not flipping on close button | Inline `style` has higher specificity than Tailwind hover classes | Drive colour from `useState` hover flag |
