# student finance tracker
 A small web app to track student spending, built with plain HTML, CSS and Javascript.

 - Live site: https://qshejantab-byte.github.io/student-finance-tracker/
 - Repo: https://github.com/qshejantab-byte/student-finance-tracker
 - Demo video:-------------------

 ## Theme

 Student Finance Tracker (budgets, transactions, search).

 ## Features

 - Add, edit and delte transaction
 - Table on big screens, cards on phones
 - Sort by date, description or amount
 - Regex search with highlighted matches
 - Dashboard: total, top category, 7 days chart, spending cap
 - Seetings: cap, base currency, manual rates, categories
 - Saves in localStorage, import and export as JSON
 - Works with the keyboard only

 ## How to run

 1. Clone the repo and open it in VS Code.
 2. Run index.html eith live server (modules do not work by double clicking).
 3. In settings, import seed.json to try it with data.

 ## Tests

 Open test.html eith live server. Every test shows PASS or Fail.

 ## Regex catalog

 - Description, no space at start or end: ^\S(?:.*\S)?$
 - No double spaces: \s{2,}
 - At least one letter (lookahead): `^(?=.*[A-Za-z]).+$
 - Repeated word (back-reference): `\b(\w+)\s+\1\b`
 - Amount: `^(0|[1-9]\d*)(\.\d{1,2})?$` (12, 12.50)
 - Date: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$` (2026-10-12)
 - Category: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` (Food, Self-care)
 - Rate: `^(0|[1-9]\d*)(\.\d{1,6})?$` (0.0007)

 Search example: `coffee|tea`, `(\w)\1` (double letters), `^Bus`, `2026-10`

## Accessibility

- Landmarks, heading, skip link, labels on all inputs
- Errors linked to fields, `aria-invalid`, `role="status"` messages
- Cap message is an ARTA live region (polite under the cap, assertive over it)
- Visible focus, reduced motion respected
- 3 breakpoints: 360px, 768px, 1024px

## Notes

Rates are typed by hand (no API). The regex ideas come from the assignement brief.

