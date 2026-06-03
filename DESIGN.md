# BrewOps Design Guidelines

## Color Palette
- Primary: Rich espresso brown (#3B1F0A) — buttons, headers, key actions
- Secondary: Warm caramel (#C8832A) — accents, highlights, hover states
- Background: Cream off-white (#FAF6F0) — main app background
- Surface: White (#FFFFFF) — cards, panels
- Success: Earthy green (#4A7C59) — stock OK, shift covered
- Warning: Amber (#E8A020) — low stock alert, near-threshold
- Danger: Muted red (#C0392B) — critical low stock, unstaffed shift
- Text Primary: Dark roast (#1A0F00)
- Text Secondary: Warm gray (#7A6A5A)
- Border: Light tan (#E8DDD0)

## Typography
- Font Family: Inter (sans-serif) for UI; consider a subtle serif accent for brand moments
- Heading Scale: 2xl/xl/lg/base — clear hierarchy
- Body: 14px base, 16px for important data
- Monospace: for stock numbers and sales figures to aid scanning

## Elevation & Spacing
- Cards: subtle shadow (shadow-sm), rounded-xl
- Consistent 4px grid spacing (p-4, p-6, gap-4)
- Section dividers: light tan border

## Component Style
- Buttons: rounded-lg, espresso brown primary, caramel hover
- Badges: pill-shaped for stock status (In Stock / Low / Critical)
- Tables: zebra striping with cream alternating rows
- Charts: warm palette (brown/caramel/amber tones)
- Alerts: left-border accent style (warning amber, danger red)
- Navigation sidebar: dark espresso background with caramel active state

## Iconography
- Use Lucide icons throughout (consistent with shadcn/ui)
- Coffee-themed section icons where appropriate (bean icon for inventory, clock for shifts, chart for sales)

## Layout
- Sidebar navigation (desktop)
- Top bar with page title and quick actions
- Main content area with card-based sections
- Responsive: stack to single column on mobile
