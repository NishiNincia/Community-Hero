# Community Hero (React)

A React + Vite conversion of the original single-file `community-hero.html` app.

## Structure

```
community-hero-react/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # top-level screen routing (role select → login → main app) + toast
│   ├── data.js             # constants (STAGES, UCFG, SCFG, LB) and seed issue data
│   ├── index.css           # global styles ported from the original <style> block
│   └── components/
│       ├── UI.jsx                # shared primitives: buttons, badge, inputs, severity bar,
│       │                          # status pipeline, issue card
│       ├── CityMap.jsx            # SVG city map
│       ├── RoleSelect.jsx         # role picker landing screen
│       ├── LoginForm.jsx          # citizen / government login form
│       ├── MainApp.jsx            # header, nav, tab routing, modal orchestration
│       ├── Dashboard.jsx          # citizen dashboard tab
│       ├── IssuesTab.jsx          # issue list + filters tab
│       ├── MapTab.jsx             # full map tab
│       ├── AnalyticsTab.jsx       # analytics/charts tab
│       ├── HeroesTab.jsx          # leaderboard/badges tab
│       ├── ReportModal.jsx        # 3-step "report an issue" modal (calls Claude API)
│       └── IssueDetailModal.jsx   # issue detail modal (status update / verify)
```

## Running it

```bash
npm install
npm run dev       # starts a local dev server (Vite)
npm run build     # production build into dist/
```

## Notes on the conversion

- All state that lived in the global `S` object is now split across `useState` hooks at the
  appropriate component level (screen/role/user/issues/toast in `App.jsx`; tab/filters/modals in
  `MainApp.jsx`; each modal's own form fields are local to that modal).
- The hand-rolled DOM helpers (`d()`, `sp()`, `mkbtn()`, etc.) were replaced with JSX and small
  reusable components in `UI.jsx`.
- The inline SVG city map (`mkMap()`) became `CityMap.jsx`, and the SVG trend chart in Analytics
  became a `TrendChart` component inside `AnalyticsTab.jsx`.
- The "Analyze with AI" call in `ReportModal.jsx` still calls
  `https://api.anthropic.com/v1/messages` directly from the browser, exactly as the original did.
  In a real deployment you'd normally proxy this through your own backend rather than calling the
  Anthropic API directly from client-side code with no key/auth handling.
- Functionality, layout, copy, and visual styling were kept as close to 1:1 with the original as
  possible — this is a structural/framework port, not a redesign.
