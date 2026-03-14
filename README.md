# CoreInventory

A full-stack inventory management system for tracking stock, warehouses, locations, and operations (receipts & deliveries).

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (via HTTP-only cookies)
- Nodemailer (OTP-based password reset)
- express-validator

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- React Router DOM

---

## Project Structure

```
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
```

---

# Getting Started

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833)

---

# 1. Clone the repository

```bash
git clone <your-repo-url>
cd coreinventory
2. Backend Setup
cd server
npm install

Create a .env file:

cp .env.example .env

Fill in your values:

PORT=5000
MONGO_URI=mongodb://localhost:27017/coreinventory
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE_MS=604800000
NODE_ENV=development
GMAIL_USER=email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

Seed the first admin user:

npm run seed:admin

Default admin credentials:

Field	Value
Login ID	admin1
Password	Admin@1234

Start the backend:

npm run dev

or

npm start

Backend runs at:

http://localhost:5000
3. Frontend Setup
cd client
npm install

Create .env file:

VITE_API_BASE_URL=http://localhost:5000/api

Run frontend:

npm run dev

Frontend runs at:

http://localhost:8080
Features
Authentication & User Management

Users self-register and are placed in pending status

Admin approves or rejects pending users

Password reset via 6-digit OTP email

Authentication via HTTP-only JWT cookies

Roles
Role	Permissions
Admin	Full access + user approval
User	Inventory operations only
Warehouses & Locations

Multiple warehouses supported

Each warehouse has a short code (2–5 chars)

Locations use full codes like:

WH1-A01
Products

Manage product name, SKU, and unit cost

Track:

On Hand

Free to Use

Manual stock adjustment available

Operations (Receipts & Deliveries)

Operations move stock in or out of warehouses.

Type	Description
IN	Receipt – adds stock
OUT	Delivery – removes stock
Status Flow
draft → ready → done
              ↘ waiting
      ↘ cancelled

Status meaning:

Draft → Editable

Ready → Stock validated

Done → Stock updated

Waiting → Insufficient stock

Cancelled → Operation cancelled

Move History

Complete audit log of stock movements including:

Product

Quantity

Operation reference

Movement type

Dashboard

Displays summary statistics:

Total receipts

Total deliveries

Late operations

Waiting deliveries

API Reference

All endpoints are prefixed with:

/api

Protected routes require JWT cookie authentication.

Auth Routes

/api/auth

Method	Endpoint	Description
POST	/signup	Register user
POST	/login	Login
POST	/logout	Logout
GET	/me	Current user
POST	/forgot-password	Send OTP
POST	/verify-otp	Verify OTP
POST	/reset-password	Reset password
GET	/pending-users	List pending users
PATCH	/approve/:userId	Approve user
PATCH	/reject/:userId	Reject user
Warehouses API

/api/warehouses

Method	Endpoint	Description
GET	/	List warehouses
POST	/	Create warehouse
GET	/:id	Get warehouse
PUT	/:id	Update warehouse
DELETE	/:id	Delete warehouse
Locations API

/api/locations

Method	Endpoint	Description
GET	/	List locations
POST	/	Create location
GET	/:id	Get location
PUT	/:id	Update location
DELETE	/:id	Delete location
Products API

/api/products

Method	Endpoint	Description
GET	/	List products
POST	/	Create product
GET	/:id	Get product
PUT	/:id	Update product
PATCH	/:id/stock	Adjust stock
DELETE	/:id	Delete product
Operations API

/api/operations

Method	Endpoint	Description
GET	/	List operations
POST	/	Create operation
GET	/:id	Get operation
PUT	/:id	Update draft
PATCH	/:id/todo	Mark ready
PATCH	/:id/validate	Validate
PATCH	/:id/cancel	Cancel
Move History API

/api/move-history

Method	Endpoint	Description
GET	/	List stock moves
Dashboard API

/api/dashboard

Method	Endpoint	Description
GET	/	Get dashboard stats
Scripts
Backend
npm run dev
npm start
npm run seed:admin
Frontend
npm run dev
npm run build
npm run lint
npm run test
Health Check
GET /api/health

Returns:

200 OK

when the server is running.


---
