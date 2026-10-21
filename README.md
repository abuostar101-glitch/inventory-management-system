# Inventory & Order Management System

A full-stack inventory and order management application. The backend is a REST API built with **ASP.NET Core 8** and **Entity Framework Core**; the frontend is a **React** single-page app that consumes it.

Built to demonstrate end-to-end ownership of a real application — database design, backend business logic, and a working front-end UI — rather than just a front-end or back-end piece in isolation.

## Features

- **Dashboard** — live stats (product count, stock value, revenue), low-stock alerts, recent orders
- **Products** — full CRUD (create, read, update, delete) with SKU, category, price, and stock tracking
- **Orders** — build an order from available stock, place it, and watch stock levels update automatically; order history with line-item detail
- **Business logic on the server** — the API validates stock availability and rejects orders that would oversell a product; stock deduction happens inside a database transaction

## Tech Stack

**Backend**
- ASP.NET Core 8 Web API (controller-based)
- Entity Framework Core 8 with SQLite (zero-setup local database; swappable for SQL Server)
- Swagger / OpenAPI for interactive API docs
- CORS configured for the React dev server

**Frontend**
- React 18 (functional components, hooks)
- Vite for local dev and builds
- Plain CSS, no UI framework

## Project Structure

```
inventory-fullstack/
├── backend/
│   └── InventoryApi/
│       ├── Controllers/       # ProductsController, OrdersController
│       ├── Models/            # Product, Order, OrderItem
│       ├── Data/              # AppDbContext, DbSeeder
│       └── Program.cs
└── frontend/
    └── src/
        ├── components/        # Dashboard, Products, Orders
        ├── api.js             # All API calls in one place
        └── App.jsx
```

## Running It Locally

You need two terminals — one for the API, one for the React app.

### 1. Backend (ASP.NET Core API)

```bash
cd backend/InventoryApi
dotnet restore
dotnet run
```

The API starts at `http://localhost:5080`. On first run it creates a local SQLite database (`inventory.db`) and seeds it with sample products. Visit `http://localhost:5080/swagger` to explore and test the API directly.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The app talks to the API automatically — make sure the backend is running first.

## What This Project Demonstrates

- Designing a relational schema (products, orders, order items) with EF Core
- Writing REST API endpoints with proper status codes (200, 201, 204, 400, 404)
- Server-side business rules: stock validation, transactional updates
- Connecting a React front-end to a real backend via `fetch`
- State management across multiple views (Dashboard, Products, Orders) using React hooks
- CORS configuration between two locally running applications

## Author

**Abubakar A**
[LinkedIn](https://linkedin.com/in/abubakar-dotnet-dev) · [GitHub](https://github.com/abuostar101-glitch)
