# Student Finance Tracker - Spec (M1)

## Data model
{ id: "rec_0001", description: "Lunch at cafeteria", amount: 12.50, category: "Food", date: "2026-10-12",
createdAt: "ISO string", updatedAt: "ISO string" }

Settings:
{ baseCurrency: "RWF", currencies: ["RWF","USD","EUR"], 
rates: { USD: 0.0007, EUR: 0.0006 },
cap: -, categories: ["Food","Books","Transport","Entertainment","Fees","other"] }

(cap 0  means no cap)

Storage keys: sft:records, sft:settings

## Pages (one page, the nav links jump to each section)
About | Dashboard | Records | Add/Edit | Settings

## Wireframe - mobile (360px)
[header: title]
[nav links stacked]
[main: sections one under the other]
  Records = list of cards (descriptions, amount, category, date, Edit/Delete)
  Dashboard = stat boxes stacked + 7 day bars + cap message
[footer]

## Wireframe - desktop (1024px)
[header: title | nav links in a row]
[main]
  Records = full table, columns: Date | Description | Category | Amount | Actions
  Dashboard = stat boxes in a row, 7 days chart under them
[footer]

## Accessibility plan
- Landmarks: header, nav, main, section, footer
- Skip to content link first in the page
- One h1, h2 per section
- Every input has a label, errors shown under the input with aria-describedly
- Visible focus outline on everything
- Cap message in aria-live (polite under cap, assertive over cap)
- Form and search messages in role="status"
- Whole app usable with keyboard only
- Constrast at least 4.5:1
- Breakpoints: 360, 768, 1024