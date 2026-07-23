# Community Hero — Backend

Real backend for the Community Hero civic grievance app, implementing the five-agent AI pipeline, geo-clustering/consensus, deterministic routing, and resolution auditing described in the architecture doc.

## Setup

```bash
npm install
cp .env.example .env      # edit JWT_SECRET; ANTHROPIC_API_KEY is optional
npm run seed               # creates data.sqlite with demo users + issues
npm start                  # runs on http://localhost:4000
```

Demo logins created by `npm run seed`:
- Citizen: `naomi@example.com` / `password123`
- Government: `sharma@municipality.gov` / `password123` / Employee ID `GOV-2024-1847`

Without `ANTHROPIC_API_KEY` set, all agents run in **heuristic/rule-based fallback mode** — fully functional, just simpler than the real model calls (keyword-based classification instead of LLM classification, etc). Set the key in `.env` to switch every agent over to real Claude calls with no other code changes.

## Architecture

```
src/
  agents/
    intakeAgent.js            # normalizes raw citizen text/voice-transcript
    classificationAgent.js    # assigns category, subcategory, severity, urgency
    duplicateCheckAgent.js    # geo-clustering + consensus/escalation tiers
    routingAgent.js           # deterministic category+ward -> department/SLA
    resolutionAuditAgent.js   # verifies closure photo before accepting "Resolved"
    orchestrator.js           # chains all five agents for a new complaint
  services/
    geoUtils.js                # haversine distance (swap for PostGIS ST_DWithin in prod)
    aiClient.js                 # thin Claude API wrapper with fallback detection
  routes/
    auth.js, complaints.js, dashboard.js, leaderboard.js, config.js
  config/
    categories.json            # editable category -> department -> SLA lookup table
  models/schema.sql            # SQLite schema (users, complaints, clusters, audit_log)
```

`data.sqlite` stands in for Postgres+PostGIS in this build so it runs anywhere with no external DB server. `geoUtils.js` is isolated specifically so the clustering query can be swapped for a real `ST_DWithin` query against a PostGIS geography column without touching any agent logic.

## API Reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/citizen/register` | — | `{name, email, password, phone}` |
| POST | `/api/auth/citizen/login` | — | `{email, password}` |
| POST | `/api/auth/government/login` | — | `{email, password, empId, dept}` (auto-provisions on first login) |
| POST | `/api/complaints/preview` | citizen | Runs the full agent pipeline, does NOT save. Matches the filing modal's AI-review step. |
| POST | `/api/complaints` | citizen | Persists a complaint using a preview's output. Matches "Confirm & Submit". |
| GET | `/api/complaints?status=&ward=&category=` | any | List/filter complaints |
| GET | `/api/complaints/:id` | any | Single complaint detail |
| PATCH | `/api/complaints/:id/status` | government | `{status}` — one of Reported/Verified/Assigned/In Progress/Resolved |
| POST | `/api/complaints/:id/resolve` | government | `{resolutionPhotoUrl}` — gated by Resolution-Audit Agent |
| POST | `/api/complaints/:id/verify` | citizen | Upvote/consensus-confirm an existing complaint |
| GET | `/api/dashboard/stats` | any | Stat cards + ward/category hotspots |
| GET | `/api/leaderboard` | any | Top citizens by points |
| GET | `/api/config/categories` | any | The editable category/department/SLA table |

All authenticated routes expect `Authorization: Bearer <token>` from a login response.

## Testing the pipeline

`test_pipeline.sh` exercises the full flow end-to-end, including the consensus feature: it files one complaint, then files a second complaint ~30m away in the same category from a different citizen, and confirms the second one is merged into the same cluster with a consensus message rather than creating a duplicate ticket.

```bash
npm start &
bash test_pipeline.sh
```

## Connecting the existing frontend

The response shapes in `complaints.js` (`toFrontendShape`) intentionally mirror the field names already used in `community_hero_v2.html`'s hardcoded `S.issues` array (`id, title, cat, sev, urg, dept, status, eta, votes, lat, lng, ward, desc, sum, stage`), so the existing UI components (`issCard`, `mkMap`, `pip`) can render real API data with minimal changes — mainly replacing `S.issues` with a `fetch('/api/complaints')` call and wiring the 3-step filing modal to `POST /api/complaints/preview` (step 2) then `POST /api/complaints` (step 3).
