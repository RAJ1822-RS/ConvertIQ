# ConvertIQ — AI-Powered Commerce & Growth Engine

ConvertIQ is an AI-powered commerce and merchant growth prototype designed for the **Razorpay AI Buildathon**.

The core loop is **Observe → Understand → Act → Learn**:

- **AI Commerce** — helps shoppers find the right product from natural language intent (category + budget + use case).
- **AI Growth** — helps merchants act on commerce/payment signals (checkout abandonment, payment recovery, high-intent customers, revenue opportunities).

# Working product (demo) | # 100% self-contained | # No external AI API required

---

## Quick Start

Requirements: Node.js 18+ and npm.

```bash
cd convert-iq
npm install
npm start
```

`npm start` runs **both** the backend API (port `5000`) and the frontend (port `5173`).

Open **http://localhost:5173**.

Run separately if you prefer:

```bash
npm run dev           # frontend (Vite), http://localhost:5173
npm run dev:server    # backend (Express), http://localhost:5000
```

Production build:

```bash
npm run build
npm run preview
```

---

## Demo Script (for placement demo)

1. Open the **Live Demo** page (the shop).
2. Type in the search bar or the chat panel:

   > `headphones under ₹5,000 for travel`

   ConvertIQ detects category **Headphones**, budget **₹5,000**, use case **Travel** and recommends **Pulse Pro Headphones** (₹4,999, 99% AI match) with a human-readable reason.

3. Ask:

   > `running shoes under ₹4,000 for gym`

   ConvertIQ recommends **AeroFit Running Shoes** (₹3,799, 99% AI match).

4. The recommended product is highlighted in the grid with an **AI Recommended** card and a summary banner.
5. Open **AI Growth** — a live merchant opportunity (high-intent checkout exits).
6. Open **Dashboard** — merchant overview with revenue opportunity, successful payments, high-intent customers, conversion rate, AI Insights and a conversion funnel.
7. Click **Ask ConvertIQ** (bottom-right) and ask the growth copilot a question:

   > `what should I focus on today?` or `should I run a discount campaign?`

---

## Features

### AI Commerce (Lexical Intent Engine)

- Only needs an Express server — no external AI API, works fully offline.
- Extracts from a natural language query:
  - **Category** (headphones, shoes, smartwatch, laptop, speaker, backpack)
  - **Budget** (`under ₹5,000`, `below 5,000`, `within`, `budget of`)
  - **Use case** (travel, fitness, gym, college, work, coding, gift)
- Scores the product catalog, ranks by match, and returns a **matched product + human-readable reason**.
- Highlights the recommendation in the shopping UI with an AI match %.

### AI Growth

- Merchant dashboard with live metrics and a conversion funnel.
- Opportunity cards: checkout abandonment, returning customers, mobile conversion gap.
- **AI Growth Copilot**: a natural-language assistant that answers merchant questions about payments, campaigns, customers, revenue and conversion with reasoned recommendations.
- API endpoints for dashboard metrics, AI opportunities and payment events.

### Product Catalog (6 products)

| Product | Category | Price |
| --- | --- | --- |
| Pulse Pro Headphones | Headphones | ₹4,999 |
| AeroFit Running Shoes | Running Shoes | ₹3,799 |
| Nova Smartwatch | Smartwatch | ₹5,499 |
| ByteBook Air 14 | Laptop | ₹44,999 |
| SoundCore Mini | Speaker | ₹2,499 |
| UrbanPack Pro | Backpack | ₹2,999 |

---

## Tech Stack

- **Frontend:** React 18, Vite 6, lucide-react, plain CSS (responsive, mobile-friendly)
- **Backend:** Node.js, Express, CORS, dotenv
- **No database needed** — catalog and metrics are in-memory demo data

---

## Project Structure

```
convert-iq/
├── index.html              # Vite HTML entry
├── vite.config.js          # React plugin config
├── dev.js                  # One-command launcher (API + frontend)
├── package.json
├── src/
│   ├── main.jsx            # All React components (App, Home, Commerce, Growth, Dashboard, Shop, MiniChat)
│   └── styles.css          # Full stylesheet (responsive)
└── server/
    ├── index.js            # Express API — intent engine + growth endpoints
    └── package.json
```

---

## API Reference

Base URL: `http://localhost:5000`

### `GET /api/health`

Server status check.

### `POST /api/intent`

AI Commerce — analyze a customer's shopping query and return a recommendation.

```json
{ "message": "headphones under ₹5,000 for travel" }
```

Response:

```json
{
  "success": true,
  "intent": { "level": "HIGH", "category": "Headphones", "useCase": "Travel", "budget": 5000 },
  "recommendation": {
    "name": "Pulse Pro Headphones",
    "price": 4999,
    "match": 99,
    "reason": "Strong audio performance with a comfortable design for long listening sessions."
  },
  "alternatives": [ { "name": "SoundCore Mini", "price": 2499, "match": 70 } ]
}
```

### `GET /api/dashboard`

Dashboard metrics and AI insights.

### `GET /api/ai/opportunities`

Listing of merchant growth opportunities with priority, value and confidence.

### `POST /api/ai/copilot`

Merchant-facing natural-language assistant.

```json
{ "message": "what should I focus on today?" }
```

### `POST /api/payment/event`

Logs a payment event (demo webhook hook point for Razorpay).

---

## How the Intent Engine Works

1. Normalize the query to lowercase.
2. **Category detection** — keyword rules over the catalog.
3. **Use-case detection** — travel / fitness / college / work / coding / gift.
4. **Budget detection** — regex for `under`, `below`, `less than`, `within`, `budget of`, `around`.
5. **Scoring** — each product starts at 50, adds 30 for category match, 10 for use-case match, 10 if within budget (−20 if over).
6. **Ranking** — highest score wins; clamped to a 65–99 match %.

---

## Future Work (beyond the prototype)

- Connect `/api/payment/event` to real Razorpay Payment Gateway webhooks.
- Replace the lexical intent engine with an LLM (e.g., OpenAI) while keeping the same request/response contract.
- Persist metrics and sessions in a database.
- Add checkout-recovery flows (payment retry, assisted checkout).