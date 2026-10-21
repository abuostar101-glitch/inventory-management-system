# Inventory Management System

A full-stack Inventory Management System built with **ASP.NET Core 8 Web API, React, Entity Framework Core, and SQLite** to manage products, monitor stock levels, and handle customer orders.

## Overview

This project demonstrates full-stack development using a RESTful API backend and a React frontend. It provides product management, low-stock visibility, and order processing with persistent data storage.

## Tech Stack

### Backend
- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger / OpenAPI

### Frontend
- React
- Vite
- JavaScript
- HTML5 and CSS3

### Development Tools
- Visual Studio / Visual Studio Code
- Git and GitHub
- npm

## Features

### Product Management
- Create, view, update, and delete products.
- View individual product details.
- Identify products with low stock.

### Order Management
- Manage customer order information.
- Add products to orders with quantities and unit prices.
- Calculate order totals.
- Store order and order-item data in SQLite.

### API Development
- RESTful endpoints built with ASP.NET Core Web API.
- Entity Framework Core for database operations.
- Swagger / OpenAPI for exploring and testing API endpoints.

### User Interface
- React-based frontend powered by Vite.
- Frontend integration with the backend API.
- Separate frontend and backend applications.

## Project Structure

```text
inventory-management-system/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

*Note: The folder names shown inside `backend/` are illustrative. Your actual structure may differ.*

## Prerequisites

Install the following before running the application:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abuostar101-glitch/inventory-management-system.git
cd inventory-management-system
```

### 2. Run the Backend

Open a terminal in the repository root:

```bash
cd backend
dotnet restore
dotnet run
```

If the backend contains multiple project files, run `dotnet run --project` with the path to the correct `.csproj` file.

Check the terminal output for the actual backend URL and port. Open the Swagger URL shown by the application, if Swagger is enabled in the current environment.

### 3. Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL printed by Vite in your terminal. The development server commonly uses `http://localhost:5173`.

### 4. Database Configuration

The application uses SQLite with Entity Framework Core.

Before running the project, check the backend configuration for the database connection string and confirm how the application creates or initializes the database. If migrations are configured, apply the required migrations before using the application.

Ensure that the frontend API base URL matches the backend URL, and that the backend's CORS configuration permits the frontend development origin.

## Learning Outcomes

Through this project, I practised:

- Building RESTful APIs with ASP.NET Core.
- Using Entity Framework Core for database access.
- Designing relational data models for products and orders.
- Integrating a React frontend with a .NET backend.
- Implementing CRUD operations and order-processing workflows.
- Exploring and testing API endpoints using Swagger / OpenAPI.
- Managing source code with Git and GitHub.

## Future Improvements

- Add authentication and role-based access control.
- Implement automated unit and integration tests.
- Add pagination, filtering, and search.
- Improve validation and error handling.
- Deploy the application to a cloud hosting platform.

## Author

**Abubakar A.**

- GitHub: [abuostar101-glitch](https://github.com/abuostar101-glitch)
- Project Repository: [Inventory Management System](https://github.com/abuostar101-glitch/inventory-management-system)

---

*Developed as a full-stack learning project to strengthen practical skills in .NET development, database management, REST APIs, and React.*
