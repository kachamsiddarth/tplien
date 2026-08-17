# Stock Trading Platform — Frontend Implementation Plan

## 1. Project Goal

Build a modern trading/investment frontend for the existing Stock project.

The frontend must:

- Be built from scratch.
- Connect to the existing Express backend.
- Use the existing MongoDB-backed data.
- Use the existing stock API integration through the backend.
- Preserve the current backend.
- Follow the functional structure of the reference Zerodha repository.
- Replace the old visual style with a premium **Neo-Brutalist + Dark Fintech + 3D** design.

Reference repository:

`https://github.com/kachamsiddarth/Zerodha`

The reference repository is a **functional/architectural reference**, not a UI to copy exactly.

---

# 2. Current Project State

The current local project contains a backend only.

```text
STOCK/
├── backend/
│   ├── models/
│   │   ├── HoldingsModel.js
│   │   ├── OrdersModel.js
│   │   ├── PositionsModel.js
│   │   └── StockModel.js
│   │
│   ├── schemas/
│   │   ├── HoldingsSchema.js
│   │   ├── OrdersSchema.js
│   │   ├── PositionsSchema.js
│   │   └── StockSchema.js
│   │
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    └── DOES NOT EXIST YET
```

The frontend must therefore be created from scratch.

---

# 3. Critical Backend Rule

## DO NOT break the existing backend.

Do not unnecessarily modify:

```text
backend/models/
backend/schemas/
backend/index.js
backend/.env
```

The backend is already working.

If a backend modification becomes genuinely necessary:

1. Stop before making the change.
2. Explain what is missing.
3. Explain why it is required.
4. Identify the exact file.
5. Make the smallest possible change.

Do not silently rewrite the backend.

---

# 4. Existing Backend

The backend runs on:

```text
http://localhost:3002
```

## Existing endpoints

### Holdings

```http
GET http://localhost:3002/allHoldings
```

This returns holdings stored in MongoDB.

---

### Positions

```http
GET http://localhost:3002/allPositions
```

This returns positions stored in MongoDB.

---

### Stock data

```http
GET http://localhost:3002/api/stocks/:symbol
```

Example:

```http
GET http://localhost:3002/api/stocks/RELIANCE
```

The backend handles communication with the external stock API.

## Important

The React frontend must **NOT** call the external stock API directly.

Correct:

```text
React
  ↓
Express backend
  ↓
External Stock API
  ↓
MongoDB / backend processing
  ↓
Express
  ↓
React
```

Incorrect:

```text
React
  ↓
External Stock API
```

API keys must remain backend-only.

---

# 5. Frontend Technology

Use:

- React
- Vite
- JavaScript
- React Router
- Axios
- Chart.js
- react-chartjs-2
- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion

Do not introduce unnecessary frameworks or dependencies.

The code should remain understandable to a developer who knows React, JavaScript, APIs, Express and MongoDB.

---

# 6. Frontend Structure

Create:

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StockCard.jsx
│   │   ├── HoldingCard.jsx
│   │   ├── PositionCard.jsx
│   │   ├── OrderCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── ChartCard.jsx
│   │   ├── Watchlist.jsx
│   │   ├── PortfolioSummary.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Holdings.jsx
│   │   ├── Positions.jsx
│   │   ├── Orders.jsx
│   │   ├── Funds.jsx
│   │   ├── StockDetails.jsx
│   │   └── NotFound.jsx
│   │
│   ├── charts/
│   │   ├── PortfolioChart.jsx
│   │   ├── HoldingsChart.jsx
│   │   └── PerformanceChart.jsx
│   │
│   ├── three/
│   │   ├── TradingScene.jsx
│   │   ├── FloatingModel.jsx
│   │   └── ...
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── PortfolioContext.jsx
│   │
│   ├── hooks/
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── vite.config.js
```

This structure can be adjusted if there is a cleaner implementation, but keep responsibilities separated.

---

# 7. Environment Configuration

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:3002
```

Create a centralized Axios service:

```text
src/services/api.js
```

Use the environment variable rather than hardcoding the backend URL throughout the application.

Example concept:

```js
axios.create({
    baseURL: import.meta.env.VITE_API_URL
});
```

Never expose:

```text
MONGO_URL
STOCK_API_KEY
```

to the frontend.

---

# 8. Reference Project Functionality

Use the reference repository to understand the intended trading-platform structure.

Relevant concepts include:

- Dashboard
- Home
- Holdings
- Positions
- Orders
- Funds
- Watchlist
- Summary
- TopBar
- Navigation
- Charts
- Stock information
- Buy/Sell interface

The reference frontend also contains landing-page concepts such as:

- Home
- Products
- Pricing
- About
- Signup
- Support
- Navbar
- Footer

Keep the **concept and functionality**, but redesign the interface completely.

---

# 9. Design Direction

The main design language is:

# NEO-BRUTALISM + DARK FINTECH + 3D

The UI should feel like a real modern fintech product rather than a tutorial project.

Visual characteristics:

- Thick borders
- Strong shadows
- Offset shadows
- Large typography
- High contrast
- Chunky cards
- Bold buttons
- Dark background
- Green/emerald financial accents
- Yellow highlights
- Off-white surfaces
- Purple/orange accents used sparingly
- Interactive hover effects
- Smooth transitions
- 3D visual elements
- Data-driven charts
- Floating UI
- Slightly playful neo-brutalist composition

Do not make it look like:

- Bootstrap
- Material UI
- A generic admin template
- A basic Zerodha clone
- A standard dashboard generated from a template

---

# 10. Suggested Color System

Use a primarily dark palette.

```text
Background:
#080B0A

Dark card:
#111715

Secondary card:
#151A18

Primary accent:
Emerald / bright green

Secondary accents:
Yellow
Off-white
Soft purple
Muted orange
```

Do not use every accent simultaneously.

The overall product should still look cohesive.

---

# 11. Landing Page

Create:

```text
/
```

as the main landing page.

The landing page should combine:

```text
Neo-Brutalism
+
Dark Fintech
+
3D
+
Trading
```

---

# 12. Landing Hero

The hero should contain:

### Left side

Large headline such as:

> TRADE THE MARKET.  
> OWN THE MOMENT.

A short supporting description.

Primary CTA:

```text
Explore Dashboard
```

Secondary CTA:

```text
View Markets
```

### Right / Center

Interactive Three.js scene.

Possible concept:

- Financial sphere
- Market globe
- Abstract trading object
- Floating market visualization

The object should:

- Rotate slowly.
- React subtly to mouse movement.
- Use particles.
- Have floating geometric objects.
- Have subtle lighting.
- Feel premium.
- Not interfere with readability.

Use:

```text
@react-three/fiber
@react-three/drei
```

---

# 13. Floating Market Cards

Around the 3D object, display small animated cards such as:

```text
NIFTY 50
+1.42%
```

```text
SENSEX
+0.87%
```

```text
RELIANCE
+1.44%
```

```text
TCS
-0.59%
```

These are visual hero elements.

They do not need to represent live data unless a real API source is intentionally connected.

---

# 14. Landing Page Navigation

Create a floating navigation near the bottom of the hero.

Navigation:

```text
Home
Markets
Portfolio
Dashboard
About
```

The navigation should:

- Float above the page.
- Have strong neo-brutalist shadows.
- Have an active state.
- Animate on hover.
- Use Framer Motion.
- Work responsively.

On mobile, convert this into a fixed bottom navigation.

---

# 15. Landing Page Sections

After the hero create:

## Section 1 — Market Overview

Large market cards.

Examples:

```text
NIFTY 50
SENSEX
BANK NIFTY
```

---

## Section 2 — Why This Platform

Three or four neo-brutalist cards.

Examples:

```text
Real-Time Market Data
Portfolio Intelligence
Simple Trading Experience
Powerful Analytics
```

---

## Section 3 — Portfolio Intelligence

Show a large data visualization.

Use Chart.js.

---

## Section 4 — 3D Interactive Section

Another visually interesting Three.js section.

Do not make the scene unnecessarily heavy.

---

## Section 5 — CTA

Example:

> START EXPLORING THE MARKET.

Button:

```text
Open Dashboard
```

---

## Section 6 — Footer

Include:

- Product
- Markets
- Dashboard
- About
- GitHub
- Contact

---

# 16. Dashboard

Create:

```text
/dashboard
```

This is the main application.

The dashboard should feel like a modern trading terminal.

---

# 17. Dashboard Layout

Suggested structure:

```text
--------------------------------------------------
TOP NAV
Logo | Search | Market Status | Profile
--------------------------------------------------

SIDEBAR / NAVIGATION

Dashboard
Markets
Holdings
Positions
Orders
Funds

--------------------------------------------------

MAIN CONTENT

Good evening, Trader.

[ Portfolio Value ]
[ Today's P&L ]
[ Total Investment ]
[ Overall Return ]

--------------------------------------------------

[ Portfolio Performance Chart ]

--------------------------------------------------

[ Holdings ]       [ Market Overview ]

--------------------------------------------------

[ Recent Orders ]  [ Watchlist ]

--------------------------------------------------
```

The layout must be responsive.

---

# 18. Dashboard Data

Do NOT hardcode portfolio values.

Fetch:

```http
GET /allHoldings
```

Use the returned MongoDB data.

Example holding:

```json
{
    "name": "RELIANCE",
    "qty": 1,
    "avg": 2193.7,
    "price": 1310,
    "net": "+1.44%",
    "day": "+1.44%",
    "investment": 2193.7,
    "currentValue": 1310,
    "pnl": -883.7
}
```

Calculate totals dynamically.

### Total investment

```text
sum(avg × qty)
```

### Current value

```text
sum(price × qty)
```

### Total P&L

```text
currentValue - totalInvestment
```

Do not hardcode these calculations.

---

# 19. Holdings Page

Create:

```text
/holdings
```

Fetch:

```http
GET /allHoldings
```

Display:

- Stock symbol
- Quantity
- Average price
- Current price
- Investment
- Current value
- P&L
- Day change
- Percentage change

Use a responsive table on desktop and cards on smaller screens.

Positive values should have a positive visual state.

Negative values should have a negative visual state.

Do not modify the backend data structure simply to fit the UI.

Map backend data to the UI.

---

# 20. Positions Page

Create:

```text
/positions
```

Fetch:

```http
GET /allPositions
```

Display:

- Product
- Stock
- Quantity
- Average price
- Current price
- P&L
- Day change
- Status

Use responsive cards/table.

---

# 21. Orders Page

The backend contains:

```text
OrdersModel.js
OrdersSchema.js
```

Before implementing the Orders page:

1. Inspect the existing backend.
2. Determine whether an Orders API endpoint already exists.

If an endpoint exists:

Use the actual endpoint.

If an endpoint does NOT exist:

Do not invent fake order execution.

Create the UI structure and isolate the API function for future backend integration.

The UI should represent:

```text
BUY
SELL
```

and:

- Stock
- Quantity
- Price
- Order type
- Status
- Timestamp

---

# 22. Funds Page

Create:

```text
/funds
```

Show:

- Available funds
- Used margin
- Available margin
- Total portfolio value

Use large visual cards.

Add a Chart.js allocation visualization.

If real fund data does not exist in the backend:

Do not pretend that fake values are real.

Clearly separate placeholder UI from real backend data.

---

# 23. Watchlist / Markets

Create a market/watchlist section.

Allow searching for stocks such as:

```text
RELIANCE
TCS
INFY
HDFCBANK
SBIN
ITC
BHARTIARTL
```

When a stock is selected, call:

```http
GET /api/stocks/:symbol
```

Example:

```http
GET /api/stocks/RELIANCE
```

---

# 24. Stock Details Page

Create:

```text
/stock/:symbol
```

Fetch the stock through the backend.

Display:

- Company name
- Symbol
- Current price
- Percentage change
- BSE price
- NSE price
- Industry
- Last updated

Also include:

- Price visualization
- Market statistics
- Buy button
- Sell button

Important:

If the backend does not already contain order execution:

The Buy/Sell buttons must be UI-only.

Do not fake successful transactions.

---

# 25. Charts

Use:

```text
Chart.js
react-chartjs-2
```

Create:

1. Portfolio value chart
2. P&L chart
3. Holdings allocation chart
4. Daily performance chart

Customize Chart.js:

- Grid
- Tooltips
- Typography
- Borders
- Spacing
- Animations
- Labels

Charts should visually belong to the neo-brutalist design.

Do not use default Chart.js styling.

---

# 26. Three.js Requirements

Use Three.js primarily for:

- Landing hero
- Interactive financial scene
- Floating market objects
- Particles
- Abstract financial visualizations

Possible objects:

- Financial sphere
- Globe
- Coins
- Floating cubes
- Rings
- Market lines
- Particles

Use subtle mouse interaction.

Performance is important.

Avoid unnecessary complexity.

---

# 27. Framer Motion

Use Framer Motion for:

- Page transitions
- Card entrance animations
- Hover effects
- Button interactions
- Number transitions
- Navbar transitions
- Modal transitions
- Chart entrance animations

Do not animate every element.

Animations should feel intentional and smooth.

---

# 28. Responsive Design

Support:

- Desktop
- Laptop
- Tablet
- Mobile

### Desktop

Use:

- Sidebar
- Large dashboard
- Floating navigation

### Mobile

Use:

- Bottom navigation
- Stacked cards
- Responsive charts
- Scrollable tables or card conversion
- Smaller 3D scene

---

# 29. Loading States

Every API-driven component must have a loading state.

Examples:

```text
Loading portfolio...
```

```text
Loading holdings...
```

```text
Loading stock data...
```

Do not show blank screens while requests are pending.

---

# 30. Error States

Every API-driven component must have an error state.

Example:

```text
Unable to load holdings.
Try again.
```

If the backend is unavailable:

```text
Backend connection unavailable.
```

The application must not crash.

---

# 31. Empty States

Examples:

```text
No holdings available.
```

```text
No positions available.
```

```text
No orders found.
```

Empty states should be visually polished.

---

# 32. Authentication

Do not implement fake authentication.

If authentication is not currently implemented by the backend:

- Create UI structure only if necessary.
- Clearly isolate it for future implementation.
- Do not pretend authentication is functional.

---

# 33. Branding

Do not copy Zerodha branding.

Create a new visual identity.

Possible names:

```text
STOCK.
TRADEX
MARKETX
```

Choose one consistent brand.

Do not use Zerodha's logo, exact branding or proprietary visual identity.

---

# 34. Reusable Components

Avoid putting the whole application in `App.jsx`.

Create reusable components such as:

```jsx
<StatCard />
<StockCard />
<PortfolioCard />
<ChartCard />
<HoldingTable />
<PositionTable />
<MarketTicker />
<BottomNav />
<Sidebar />
<NeoButton />
```

Keep components focused.

---

# 35. API Rules

All frontend API requests must be centralized.

Example:

```text
src/services/api.js
```

Functions can include:

```js
getHoldings()
getPositions()
getStock(symbol)
getOrders()
```

Do not repeat Axios configuration throughout components.

---

# 36. No Fake Portfolio Data

This is mandatory.

Do NOT create fake portfolio holdings such as:

```text
RELIANCE 100 shares
TCS 50 shares
```

Portfolio data must come from:

```http
GET /allHoldings
```

Positions must come from:

```http
GET /allPositions
```

Stock information must come from:

```http
GET /api/stocks/:symbol
```

Static data is acceptable only for visual landing-page elements where no backend data is expected.

---

# 37. Security

Never expose:

```text
MONGO_URL
STOCK_API_KEY
```

Never connect directly to MongoDB from React.

Never call the external stock API directly from React.

Never put backend secrets inside:

```text
VITE_*
```

environment variables.

---

# 38. Development Rules

Do not attempt to implement the entire application blindly in one step.

Work task-by-task.

After each task:

1. Verify the code.
2. Run the frontend.
3. Check the browser.
4. Check the console.
5. Fix errors.
6. Only then continue.

---

# 39. Implementation Tasks

## Task 1 — Frontend Initialization

- Create `frontend/`.
- Initialize React + Vite.
- Install required dependencies.
- Confirm the frontend runs.
- Do not modify backend.

### Completion criteria

```text
npm run dev
```

works successfully.

---

## Task 2 — Global Design System

Create:

- Global typography
- Colors
- Borders
- Shadows
- Buttons
- Cards
- Responsive rules
- Neo-brutalist utility styles

### Completion criteria

The project has a consistent visual language.

---

## Task 3 — Routing

Implement React Router.

Routes:

```text
/
/dashboard
/holdings
/positions
/orders
/funds
/stock/:symbol
```

### Completion criteria

Every route renders correctly.

---

## Task 4 — API Service

Create:

```text
src/services/api.js
```

Connect:

```text
/allHoldings
/allPositions
/api/stocks/:symbol
```

### Completion criteria

Frontend can successfully request backend data.

---

## Task 5 — Landing Page

Implement:

- Hero
- Navigation
- Market cards
- Feature sections
- CTA
- Footer

### Completion criteria

Landing page is responsive and visually polished.

---

## Task 6 — Three.js Hero

Implement:

- 3D financial object
- Particles
- Floating elements
- Mouse interaction
- Lighting
- Animation

### Completion criteria

3D scene works without breaking the page.

---

## Task 7 — Dashboard

Implement:

- Portfolio summary
- Stat cards
- Portfolio chart
- Market overview
- Holdings preview
- Watchlist
- Recent orders area

### Completion criteria

Portfolio values are calculated from actual backend holdings.

---

## Task 8 — Holdings

Connect:

```http
GET /allHoldings
```

Implement:

- Holdings table
- Mobile cards
- P&L
- Current value
- Investment
- Percentage states

### Completion criteria

MongoDB holdings are displayed correctly.

---

## Task 9 — Positions

Connect:

```http
GET /allPositions
```

Implement positions UI.

### Completion criteria

MongoDB positions appear correctly.

---

## Task 10 — Orders

Inspect the backend.

If an orders endpoint exists:

Connect it.

If not:

Build UI only and clearly isolate future API integration.

---

## Task 11 — Stock Search

Implement:

- Search input
- Stock selection
- Navigation to `/stock/:symbol`

---

## Task 12 — Stock Details

Connect:

```http
GET /api/stocks/:symbol
```

Display the real backend response.

---

## Task 13 — Chart.js

Implement:

- Portfolio chart
- P&L chart
- Allocation chart
- Performance chart

---

## Task 14 — Mobile Experience

Implement:

- Bottom navigation
- Responsive cards
- Responsive charts
- Mobile stock search
- Mobile 3D scaling

---

## Task 15 — Animations

Add Framer Motion carefully.

---

## Task 16 — Error/Loading/Empty States

Ensure every API-driven screen handles:

```text
Loading
Success
Error
Empty
```

---

## Task 17 — Final UI Polish

Review:

- Spacing
- Typography
- Shadows
- Borders
- Animations
- Responsive behavior
- Accessibility
- Visual consistency

---

## Task 18 — Final Testing

Verify:

```text
[ ] Frontend starts
[ ] Backend starts
[ ] Dashboard works
[ ] Holdings work
[ ] Positions work
[ ] Stock search works
[ ] Stock details work
[ ] Charts work
[ ] Three.js works
[ ] Navigation works
[ ] Mobile layout works
[ ] Loading states work
[ ] Error states work
[ ] No backend functionality is broken
[ ] No API keys are exposed
```

---

# 40. Final Quality Standard

The finished project should feel like:

```text
REAL FINTECH PRODUCT
        +
NEO-BRUTALISM
        +
3D EXPERIENCE
        +
TRADING TERMINAL
        +
REAL BACKEND DATA
        +
CHARTS
        +
SMOOTH ANIMATION
```

The result should be good enough for:

- Portfolio
- GitHub
- LinkedIn
- Hackathon demonstration
- Project showcase

However:

**Functionality is more important than visual effects.**

Do not sacrifice working API integration for visual effects.

---

# 41. Most Important Instruction

Build the frontend around the **existing backend**.

Do not create a new backend.

Do not replace the existing backend.

Do not create fake portfolio data.

Do not expose API keys.

Do not call the external stock API directly from React.

Use:

```text
React
  ↓
Axios
  ↓
Express backend
  ↓
MongoDB / Stock API
```

The frontend should be a polished, modern, neo-brutalist trading interface sitting on top of the backend that already exists.
