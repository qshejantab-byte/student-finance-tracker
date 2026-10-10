# Studnet Finance Tracker - Spec (M1)

## Data model 
Record:
{
    id: "rec_0001", description: "Lunch at cafeteria:, amount: 12.50, category: "Food", date: "2026-10-12:", createdAT: "ISO string", updatedAT: "ISO string" 
}

Settings:
{
    baseCureency: "RWF", currencies: ["RWF","USD","EUR"], rates: {USD: 0.0007, EUR: 0.0006 }, cap: 100000, categories: ["Food","Books","Transport","Entertainment","Fees","Other"]
}

Storage keys: sft:records, sft:settings

## Pages (one page, nav switches sections)
About | Dashboard | Records | Add/Edit | Seetings

## Wireframe - mobile (360px)
[header: title + menu button]
[nav links stacked]
[main: one section at a time]
   Records= list of cards (description, amount, category, date, Edit/Delete)
   Dashboard= stat boxes in a row, 7 day chart under them [footer]

   ## Accessibilty plan
   -Landmarks: header, nav, main, section, footer
   -Skip to content link first in the page
   -One h1, h2 per section
   -Every input has a label, errors shown under the input with aria-describedly
   -Visible focus outline on everything
   -Cap message in aria-live (polite under cap, assertive over cap)
   -From and search messages in role="status"
   -Whole app usable with keyboard only
   -Contrast at least 4.5:1
   -Break points: 360, 768, 1024