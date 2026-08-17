# FRONTEND ARCHITECTURE — TEPLINE STOCK PLATFORM

## 1. Project Structure
```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Neobrutalist main navbar
│   │   ├── Navbar.css          # Navbar stylesheet
│   │   ├── BottomNav.jsx       # Fixed mobile navigation bar
│   │   └── BottomNav.css       # Mobile nav stylesheet
│   │
│   ├── pages/
│   │   ├── Landing.jsx         # Neobrutalist 3D Home/Landing page
│   │   ├── Landing.css         # Landing page stylesheet
│   │   ├── Dashboard.jsx       # Central terminal & portfolio overview
│   │   ├── Dashboard.css       # Dashboard stylesheet
│   │   ├── Holdings.jsx        # User holdings table with stock links
│   │   ├── Positions.jsx       # Active market positions
│   │   ├── Orders.jsx          # Order execution UI book
│   │   ├── Funds.jsx           # Account balance & margin view
│   │   ├── StockDetails.jsx    # Live stock quote & buy/sell modal page
│   │   └── NotFound.jsx        # 404 Neobrutalist error page
│   │
│   ├── three/
│   │   └── TradingScene.jsx    # Neobrutalist R3F 3D interactive yellow cube scene
│   │
│   ├── services/
│   │   └── api.js              # Centralized Axios API service
│   │
│   ├── App.jsx                 # React Router mapping
│   ├── main.jsx                # DOM root entry
│   └── index.css               # Global Pure Neobrutalism design system tokens
│
├── .env                        # Environment configuration (VITE_API_URL)
├── index.html                  # HTML entry point with Tepline branding
├── package.json                # Frontend dependencies
└── vite.config.js              # Vite configuration
```

---

## 2. Page List
- **Home / Landing (`/`)**: High-impact Neobrutalist marketing page with interactive 3D hero canvas and floating market cards.
- **Dashboard (`/dashboard`)**: Central trading terminal displaying total portfolio metrics, Chart.js line trend & asset allocation doughnut charts, top holdings table, and quick navigation.
- **Holdings (`/holdings`)**: Dynamic table of user holdings fetched live from MongoDB `/allHoldings` with search bar and stock details navigation.
- **Positions (`/positions`)**: Active intraday and derivative market positions fetched live from `/allPositions`.
- **Orders (`/orders`)**: Dedicated trade order book interface for pending and executed orders.
- **Funds (`/funds`)**: Account margin breakdown, available cash, and deposit/withdrawal options.
- **Stock Details (`/stock/:symbol`)**: Detailed live market quote page calling `/api/stocks/:symbol` with price cards, company information, and trade action buttons.

---

## 3. Route List
| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `Landing.jsx` | 3D Hero and product overview |
| `/dashboard` | `Dashboard.jsx` | Portfolio calculations & analytics |
| `/holdings` | `Holdings.jsx` | Complete user equity holdings |
| `/positions` | `Positions.jsx` | Market positions overview |
| `/orders` | `Orders.jsx` | Trade execution log |
| `/funds` | `Funds.jsx` | Account margin management |
| `/stock/:symbol` | `StockDetails.jsx` | Symbol quote & live stock details |
| `*` | `NotFound.jsx` | 404 error handler |

---

## 4. API Service & Backend Endpoints
Centralized in `src/services/api.js`:
- `GET /allHoldings` — Fetches holdings from MongoDB with calculated live prices.
- `GET /allPositions` — Fetches current user positions from MongoDB.
- `GET /api/stocks/:symbol` — Fetches stock quote from backend Indian Stock API integration and upserts into MongoDB.

---

## 5. UI Button → Route → Backend Mapping
| Element | Action / Destination Route | Triggered Backend Endpoint |
| :--- | :--- | :--- |
| Navbar "LAUNCH TERMINAL" | Navigate to `/dashboard` | `GET /allHoldings`, `GET /allPositions` |
| Landing "EXPLORE MARKETS" | Navigate to `/holdings` | `GET /allHoldings` |
| Holding Row "VIEW" | Navigate to `/stock/:symbol` | `GET /api/stocks/:symbol` |
| Refresh Button | Re-fetch current route data | Re-triggers active API endpoint |
| Stock Search Input | Navigate to `/stock/:symbol` | `GET /api/stocks/:symbol` |

---

## 6. Design System Architecture (Pure Neobrutalism)
- **Base Background**: `#F5F1E8` (Off-white / Cream).
- **Cards & Borders**: `#FFFFFF` background with `3px solid #111111` black borders.
- **Hard Shadows**: `5px 5px 0px #111111`.
- **Vibrant Accents**: Yellow (`#FFE14A`), Green (`#00E5A0`), Purple (`#C8A7FF`), Pink (`#FF8FD8`), Orange (`#FF8A3D`), Cyan (`#65B7FF`).
- **Typography**: *Plus Jakarta Sans* (Body) & *Space Grotesk* (Headings).

---

## 7. Data Flow Architecture
```text
MongoDB (Holding/Position/Stock Collection)
       ↓
Express Backend (http://localhost:3002)
       ↓
Centralized Axios Service (src/services/api.js)
       ↓
React Router Pages (Dashboard.jsx, Holdings.jsx, StockDetails.jsx)
       ↓
Neobrutalist UI Components & Chart.js / Three.js Canvas
```
