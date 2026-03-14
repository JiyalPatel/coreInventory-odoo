# CoreInventory 📦

A modular, real-time **Inventory Management System (IMS)** built to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, easy-to-use web application.

> Built as part of a hackathon project using **React, Node.js, and MongoDB**.

---

## 📽️ Demo

[Watch the demo video](#)

*(Demo link will be added later)*

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
- [Backend Routes](#backend-routes)
- [Core Concepts](#core-concepts)
- [Team](#team)

---

## Overview

CoreInventory digitizes all **stock-related operations within a business**.

It tracks every product movement — from **vendor receipt to customer delivery** — in a single centralized system with a real-time dashboard.

Instead of using:

- manual registers  
- Excel sheets  
- disconnected tracking systems  

CoreInventory provides a **single inventory platform**.

### Target Users

**Inventory Managers**
- Manage stock levels
- Monitor operations
- Track inventory analytics

**Warehouse Staff**
- Receive incoming goods
- Pick and pack deliveries
- Move items between locations
- Perform stock counts

---

## Features

### Will start working on

| Feature | Description |
|---|---|
| Authentication | User registration and login with protected routes |
| Dashboard | Key inventory statistics such as total stock, low stock alerts, pending receipts and deliveries |
| Product Management | Create products with SKU, category, unit of measure and initial stock |
| Receipts (Incoming) | Receive goods from vendors which automatically increase stock |
| Delivery Orders (Outgoing) | Ship goods to customers which automatically decrease stock |
| Stock Adjustments | Correct mismatches between recorded and physical stock |
| Move History | Complete ledger of all inventory movements with timestamps |
| Smart Filters | Filter data by status, warehouse, product category, or document type |
| Low Stock Alerts | Highlight products that fall below minimum stock level |

### If extra time is available

| Feature | Status |
|---|---|
| Internal Transfers | Planned |
| OTP Password Reset | Planned |
| Multi-warehouse Support | Partial |
| Reorder Rules | Planned |

---

## Tech Stack

### Frontend

- **React** — user interface
- **Tailwind CSS** — styling
- **React Router** — client-side navigation

### Backend

- **Node.js**
- **Express.js** — backend server
- **Mongoose** — MongoDB object modeling
- **bcryptjs** — password hashing
- **JSON Web Tokens (JWT)** — authentication

### Database

- **MongoDB (Local Instance)** — NoSQL database hosted locally

---

## Project Structure

```
CoreInventory/
├── client/                     # React frontend
│   ├── src/
│   │   ├── services/           # Helper functions for backend communication
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Products/
│   │   │   ├── Receipts/
│   │   │   ├── Deliveries/
│   │   │   ├── Adjustments/
│   │   │   └── MoveHistory/
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Helper utilities
│   │   ├── App.jsx             # Main routing
│   │   └── index.js            # Entry point
│   └── package.json
│
├── server/                     # Backend server
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/                 # Database models
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Receipt.model.js
│   │   ├── Delivery.model.js
│   │   ├── Adjustment.model.js
│   │   └── StockMove.model.js
│   ├── routes/                 # Application routes
│   ├── controllers/            # Business logic
│   ├── middleware/             # Middleware functions
│   ├── utils/                  # Shared utilities
│   ├── seed.js                 # Demo data generator
│   ├── server.js               # Server entry point
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- **Node.js (v18+)**
- **npm**
- **MongoDB Community Edition running locally**

---

### Installation

Clone the repository

```bash
git clone https://github.com/your-username/CoreInventory.git
cd CoreInventory
```

Install backend dependencies

```bash
cd server
npm install
```

Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server folder**.

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/coreinventory
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

| Variable | Description |
|---|---|
| PORT | Port for backend server |
| MONGO_URI | Local MongoDB connection string |
| JWT_SECRET | Secret used for authentication tokens |
| JWT_EXPIRES_IN | Token expiration duration |

---

## Running the App

Start MongoDB locally.

Start backend server

```bash
cd server
npm run dev
```

Backend will run at:

```
http://localhost:5000
```

Start frontend

```bash
cd client
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

## Seeding Demo Data

Populate the database with demo inventory data.

```bash
cd server
node seed.js
```

This generates:

- sample warehouses
- sample products
- receipts
- deliveries
- stock adjustments
- movement history entries

Running `node seed.js` again resets the database and recreates demo data.

---

## Backend Routes

The backend server provides routes used by the frontend to manage inventory operations.

Main modules include:

- Authentication
- Product management
- Receipts (incoming stock)
- Deliveries (outgoing stock)
- Stock adjustments
- Move history
- Dashboard statistics

All inventory operations automatically update stock quantities in the database.

---

## Core Concepts

### Inventory Flow

```
Vendor → [Receipt] → Stock +N
                         │
              [Internal Transfer] → Location change
                         │
              [Adjustment] → Stock corrected
                         │
Customer ← [Delivery] → Stock -N
```

Every stock movement is recorded in the **StockMove ledger**, providing a full history of inventory activity.

---

### Document Statuses

| Status | Meaning |
|---|---|
| Draft | Created but not confirmed |
| Waiting | Awaiting approval or availability |
| Ready | Ready to process |
| Done | Completed and stock updated |
| Cancelled | Cancelled with no stock impact |

---

## Team

| Name | Responsibility |
|---|---|
<<<<<<< HEAD
| Jiyal Patel |  |
| Vraj Vyas |  |
| Jay Patel |  |
| Raj Parikh |  |
=======
| Jiyal Patel | Frontend — Layout, Dashboard, Authentication |
| Vraj Vyas | Frontend — Products and Receipts |
| Jay Patel | Frontend — Deliveries, Adjustments, Move History |
| Raj Parikh | Backend — Server logic, database models |
>>>>>>> d98bc6f (refracted readme)

---

## License

This project was built for a **hackathon demonstration and educational purposes**.
