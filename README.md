# CoreInventory

A full-stack inventory management system for tracking stock, warehouses, locations, and operations (receipts & deliveries).

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (via HTTP-only cookies)
- Nodemailer (OTP-based password reset)
- express-validator

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- React Router DOM

---

## Project Structure
coreinventory/
├── client/ # React frontend (Vite + Tailwind)
│ ├── public/
│ ├── src/
│ │ ├── pages/ # Page components
│ │ ├── components/ # Reusable UI components
│ │ └── lib/ # API client & utilities
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── components.json
│ ├── eslint.config.js
│ ├── postcss.config.js
│ ├── tailwind.config.ts
│ ├── tsconfig.app.json
│ ├── tsconfig.node.json
│ ├── vite.config.ts
│ └── vitest.config.ts
│
└── server/ # Express backend
├── configs/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── scripts/
---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for email

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd coreinventory
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coreinventory
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE_MS=604800000
NODE_ENV=development
GMAIL_USER=email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Seed the first admin user:

```bash
npm run seed:admin
```

This creates an admin with the following default credentials (change after first login):

| Field    | Value                    |
|----------|--------------------------|
| Login ID | `admin1`                 |
| Password | `Admin@1234`             |

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

---

## Features

### Authentication & User Management
- Users self-register and are placed in **pending** status
- Admin approves or rejects pending users from the Settings page
- Password reset via 6-digit OTP sent to email
- Sessions managed via HTTP-only JWT cookies

### Roles
| Role  | Permissions                                       |
|-------|---------------------------------------------------|
| Admin | Full access + user approval/rejection             |
| User  | Access to all inventory features, no user mgmt    |

### Warehouses & Locations
- Create and manage multiple warehouses with a short code (2–5 chars)
- Each warehouse has sub-locations identified by a full code (e.g. `WH1-A01`)

### Products
- Manage products with Name, SKU Code, and Unit Cost
- Track **On Hand** and **Free to Use** quantities
- Manually adjust stock levels

### Operations (Receipts & Deliveries)
Operations move stock into or out of a warehouse.

| Type | Description          |
|------|----------------------|
| IN   | Receipt — adds stock |
| OUT  | Delivery — removes stock |

**Status workflow:**

```
draft → ready → done
              ↘ waiting (insufficient stock)
      ↘ cancelled
```

- **Draft** — created, editable
- **Mark Ready** — validates stock availability; moves to `ready` or `waiting` if short
- **Validate** — finalises the operation and updates stock levels
- **Cancel** — cancels a draft or ready operation

### Move History
Full audit log of all stock movements, showing product, quantity, type, and linked operation.

### Dashboard
Overview of receipts and deliveries — total count, late operations, and waiting deliveries.

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT cookie.

### Auth — `/api/auth`
| Method | Endpoint            | Access    | Description               |
|--------|---------------------|-----------|---------------------------|
| POST   | `/signup`           | Public    | Register a new user       |
| POST   | `/login`            | Public    | Login and receive a cookie|
| POST   | `/logout`           | Protected | Clear session cookie      |
| GET    | `/me`               | Protected | Get current user info     |
| POST   | `/forgot-password`  | Public    | Send OTP to email         |
| POST   | `/verify-otp`       | Public    | Verify OTP, get reset token|
| POST   | `/reset-password`   | Public    | Set a new password        |
| GET    | `/pending-users`    | Admin     | List users awaiting approval|
| PATCH  | `/approve/:userId`  | Admin     | Approve a pending user    |
| PATCH  | `/reject/:userId`   | Admin     | Reject a pending user     |

### Warehouses — `/api/warehouses`
| Method | Endpoint  | Description              |
|--------|-----------|--------------------------|
| GET    | `/`       | List all warehouses      |
| POST   | `/`       | Create a warehouse       |
| GET    | `/:id`    | Get warehouse by ID      |
| PUT    | `/:id`    | Update warehouse         |
| DELETE | `/:id`    | Delete warehouse         |

### Locations — `/api/locations`
| Method | Endpoint  | Description              |
|--------|-----------|--------------------------|
| GET    | `/`       | List all locations (filterable by `?warehouse=id`) |
| POST   | `/`       | Create a location        |
| GET    | `/:id`    | Get location by ID       |
| PUT    | `/:id`    | Update location          |
| DELETE | `/:id`    | Delete location          |

### Products — `/api/products`
| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| GET    | `/`            | List all products        |
| POST   | `/`            | Create a product         |
| GET    | `/:id`         | Get product by ID        |
| PUT    | `/:id`         | Update product           |
| PATCH  | `/:id/stock`   | Manually set stock level |
| DELETE | `/:id`         | Delete product           |

### Operations — `/api/operations`
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | `/`                | List operations (filterable by `?type`, `?status`, `?search`) |
| POST   | `/`                | Create an operation       |
| GET    | `/:id`             | Get operation + lines     |
| PUT    | `/:id`             | Update a draft operation  |
| PATCH  | `/:id/todo`        | Mark ready (check stock)  |
| PATCH  | `/:id/validate`    | Validate and update stock |
| PATCH  | `/:id/cancel`      | Cancel the operation      |

### Move History — `/api/move-history`
| Method | Endpoint | Description                                      |
|--------|----------|--------------------------------------------------|
| GET    | `/`      | List all stock moves (filterable by `?type`, `?search`) |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description              |
|--------|----------|--------------------------|
| GET    | `/`      | Get summary stats        |

---

## Scripts

```bash
# Backend
npm run dev         # Start with nodemon
npm start           # Start in production
npm run seed:admin  # Create the first admin user

# Frontend
npm run dev         # Start dev server
npm run build       # Production build
npm run lint        # ESLint
npm run test        # Run unit tests (Vitest)
```

---

## Health Check

```
GET /api/health
```

Returns `200 OK` when the server is running.