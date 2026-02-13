# 🚀 Fullstack Monorepo

### Prisma + Elysia + MariaDB + Vue 3 + Bun

This project is a fullstack monorepo application built using modern
technologies:

-   ⚡ Bun -- JavaScript runtime & package manager
-   🚀 Elysia -- Backend framework
-   🧠 Prisma ORM -- Database ORM
-   🗄 MariaDB -- Database
-   🖥 Vue 3 -- Frontend framework

------------------------------------------------------------------------

# 📂 Project Structure

    packages/
     ├── backend   # API Server (Elysia + Prisma + MariaDB)
     └── frontend  # Vue 3 Application

------------------------------------------------------------------------

# 🛠 Requirements

Make sure you have:

-   Bun installed → https://bun.sh
-   MariaDB running
-   A database already created

Example:

    CREATE DATABASE your_database_name;

------------------------------------------------------------------------

# ⚙️ Environment Setup

## 1️⃣ Backend Setup

Navigate to backend:

    cd packages/backend

Copy environment file:

    cp .env.dev .env

Update `.env` with your database credentials:

    DATABASE_URL="mysql://user:password@localhost:3306/your_database_name"

Install dependencies:

    bun install

Generate Prisma client:

    bun db:generate

Push schema to database:

    bun db:push

Seed database (if available):

    bun db:seed

------------------------------------------------------------------------

## 2️⃣ Frontend Setup

Navigate to frontend:

    cd packages/frontend

Install dependencies:

    bun install

------------------------------------------------------------------------

# ▶️ Run Development Server

From the root directory:

    bun dev

------------------------------------------------------------------------

# 🖱 UI Behavior

## Folder Toggle Direction

- When a folder is collapsed, the toggle icon points **to the right (▶)**.
- When the folder is expanded, the toggle icon points **downward (▼)**.
- Clicking the toggle icon switches between these two states.

## Interaction Details

- The toggle icon visually indicates the folder state.
- When expanded:
  - Subfolders become visible below the parent folder.
  - The toggle icon rotates or changes to downward.
- When collapsed:
  - Subfolders are hidden.
  - The toggle icon changes back to right direction.

## State Management

- Each folder maintains its own `isOpen` state.
- Vue 3 reactivity automatically updates the UI when `isOpen` changes.
- Nested folders follow the same toggle behavior recursively.

------------------------------------------------------------------------

# 🧠 Backend Stack

-   Elysia (HTTP Server)
-   Prisma ORM
-   MariaDB
-   Bun runtime

------------------------------------------------------------------------

# 🖥 Frontend Stack

-   Vue 3
-   Bun
-   Modern ES Modules

------------------------------------------------------------------------

# 🗄 Database

Using MariaDB with Prisma ORM.

Schema file location:

    packages/backend/prisma/schema.prisma

------------------------------------------------------------------------

# 🔧 Useful Commands

## Backend Commands

    bun db:generate   # Generate Prisma client
    bun db:push       # Push schema to database
    bun db:seed       # Seed database

If Prisma types are out of sync:

    bun db:generate

------------------------------------------------------------------------

# 📦 Production Build

To build frontend (if configured):

    bun run build

To run backend in production mode:

    bun start

------------------------------------------------------------------------

# ⚠️ Troubleshooting

If you encounter database connection issues:

-   Ensure MariaDB is running
-   Verify DATABASE_URL in `.env`
-   Make sure database exists

If Prisma throws errors:

    bun db:generate

------------------------------------------------------------------------

# 📜 License

MIT License