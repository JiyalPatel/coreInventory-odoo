# coreInventory-odoo
# CoreInventory 📦

A modular, real-time Inventory Management System built to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, easy-to-use web application.

> Built as part of a hackathon project. React + Node.js + MongoDB.

---

## 📽️ Demo

[Watch the demo video](#) <!-- video link will soon be added... -->

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Seeding Demo Data](#seeding-demo-data)
- [API Reference](#api-reference)
- [Core Concepts](#core-concepts)
- [Team](#team)

---

## Overview

CoreInventory digitizes all stock-related operations within a business. It tracks every product movement — from vendor receipt to customer delivery — in a single, centralized system with a real-time dashboard.

**Target Users:**
- **Inventory Managers** — manage incoming and outgoing stock
- **Warehouse Staff** — perform transfers, picking, shelving, and counting

---

## Features

###  Will start working on

| Feature | Description |
|---|---|
| Authentication | JWT-based sign up / login with protected routes |
| Dashboard | Real-time KPIs — total stock, low stock alerts, pending receipts & deliveries |
| Product Management | Create products with SKU, category, unit of measure, and initial stock |
| Receipts (Incoming) | Receive goods from vendors — validates and increases stock automatically |
| Delivery Orders (Outgoing) | Ship goods to customers — validates and decreases stock automatically |
| Stock Adjustments | Fix mismatches between recorded and physical stock counts |
| Move History | Full ledger of every stock movement with timestamps |
| Smart Filters | Filter by document type, status, warehouse, and product category |
| Low Stock Alerts | Visual indicators when stock falls below threshold |

### if have extra time will add

| Feature | Status |
|---|---|
| Internal Transfers | Planned |
| OTP Password Reset | Planned |
| Multi-warehouse Support | Partial |
| Reorder Rules | Planned |

---

## Tech Stack

**Frontend**
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — fast dev environment
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [React Router v6](https://reactrouter.com/) — client-side routing
- [Axios](https://axios-http.com/) — HTTP client

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — REST API server
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [JSON Web Tokens](https://jwt.io/) — authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing

**Database**
- [MongoDB Atlas](https://www.mongodb.com/atlas) — cloud-hosted NoSQL database

---

## Project Structure

```
CoreInventory/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios API call functions (one file per resource)
│   │   ├── components/         # Reusable UI components (Sidebar, DataTable, Modal…)
│   │   ├── pages/              # Feature pages grouped by route
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Products/
│   │   │   ├── Receipts/
│   │   │   ├── Deliveries/
│   │   │   ├── Adjustments/
│   │   │   └── MoveHistory/
│   │   ├── context/            # React context (AuthContext, ToastContext)
│   │   ├── hooks/              # Custom hooks (useAuth, useFetch)
│   │   ├── utils/              # Helpers and constants
│   │   ├── App.jsx             # Routes
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection
│   ├── models/                 # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Receipt.model.js
│   │   ├── Delivery.model.js
│   │   ├── Adjustment.model.js
│   │   └── StockMove.model.js  # Ledger — every movement logged here
│   ├── routes/                 # Express Router (one file per resource)
│   ├── controllers/            # Business logic called by routes
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── error.middleware.js # Global error handler
│   ├── utils/
│   │   └── stockHelpers.js     # Shared stock increase/decrease logic
│   ├── seed.js                 # Populates DB with demo data
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier is sufficient)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/CoreInventory.git
cd CoreInventory
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

---

### Environment Variables

**Server — `server/.env`**

Create a `.env` file inside the `server/` folder based on `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens (use a long random string) |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`, `24h`) |

**Client — `client/.env`**

Create a `.env` file inside the `client/` folder based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for all API requests from the frontend |

> **Note:** Never commit `.env` files. Both are listed in `.gitignore`. Only `.env.example` files are committed.

---

### Running the App

**Start the backend server**

```bash
cd server
npm run dev
```

Server runs at: `http://localhost:5000`

**Start the frontend (in a new terminal)**

```bash
cd client
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Seeding Demo Data

To populate the database with realistic sample data for demo purposes:

```bash
cd server
node seed.js
```

This creates:
- 2 warehouses (Main Warehouse, Production Floor)
- 10 sample products (Steel Rods, Chairs, etc.) with initial stock
- 5 receipts in various states (Draft, Done)
- 5 delivery orders in various states
- 3 stock adjustments
- Full stock move ledger entries for all the above

To reset and re-seed at any time, run `node seed.js` again — it clears existing data first.

---

## API Reference

All routes are prefixed with `/api`. Protected routes require a `Bearer <token>` Authorization header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/me` | Protected | Get current logged-in user |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Protected | List all products with current stock |
| POST | `/api/products` | Protected | Create a new product |
| GET | `/api/products/:id` | Protected | Get a single product |
| PUT | `/api/products/:id` | Protected | Update product details |
| DELETE | `/api/products/:id` | Protected | Delete a product |

### Receipts (Incoming Stock)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/receipts` | Protected | List all receipts |
| POST | `/api/receipts` | Protected | Create a new receipt (status: Draft) |
| GET | `/api/receipts/:id` | Protected | Get receipt details |
| PUT | `/api/receipts/:id` | Protected | Update receipt lines |
| POST | `/api/receipts/:id/validate` | Protected | Validate receipt → stock increases |

### Deliveries (Outgoing Stock)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/deliveries` | Protected | List all delivery orders |
| POST | `/api/deliveries` | Protected | Create a new delivery order |
| GET | `/api/deliveries/:id` | Protected | Get delivery details |
| PUT | `/api/deliveries/:id` | Protected | Update delivery lines |
| POST | `/api/deliveries/:id/validate` | Protected | Validate delivery → stock decreases |

### Stock Adjustments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/adjustments` | Protected | List all adjustments |
| POST | `/api/adjustments` | Protected | Create and apply a stock adjustment |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/kpis` | Protected | Returns all KPI counts for the dashboard |

### Move History

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/moves` | Protected | Full stock ledger, supports filters by product/date/type |

---

## Core Concepts

### Inventory Flow

```
Vendor → [Receipt] → Stock +N
                         │
              [Internal Transfer] → Location changes (stock total unchanged)
                         │
              [Adjustment] → Stock corrected if mismatch found
                         │
Customer ← [Delivery Order] → Stock -N
```

Every movement (receipt, delivery, adjustment) writes a record to the `StockMove` collection — this is the permanent ledger and the source of truth for the Move History page.

### Document Statuses

| Status | Meaning |
|---|---|
| Draft | Created but not confirmed |
| Waiting | Waiting for availability or approval |
| Ready | Ready to be processed |
| Done | Validated — stock has been updated |
| Cancelled | Voided, no stock impact |

### Stock Logic

All stock changes go through shared helpers in `server/utils/stockHelpers.js`:

- `increaseStock(productId, qty, warehouseId)` — used by receipts
- `decreaseStock(productId, qty, warehouseId)` — used by deliveries
- `adjustStock(productId, newQty, warehouseId)` — used by adjustments (sets absolute value, not delta)

This ensures stock logic is never duplicated across controllers.

---

## Team

| Name | Role |
|---|---|
| Jiyal Patel |  |
| Vraj Vyas |  |
| Jay Patel |  |
| Raj Parikh |  |

---

## License

This project is being built for a hackathon and is open for educational use.