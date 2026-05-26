<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Diwyani's Recipe Book

## Design

- Background: `#FFE555` (yellow)
- Accent text/UI: `#281A7C` (navy blue)
- Vibe: handmade, personal, warm — like a real recipe book

## Fonts

- **Barrio** — headings, recipe titles (chunky display)
- **Syne** — body and subtext (regular weight)

Import Barrio and Syne from Google Fonts in the `app/layout.tsx` file (via `next/font/google`).

## Where to put code

Put all the code in `app/page.tsx` and `app/globals.css` to start. Extract components into `components/` only when the page grows unwieldy.
