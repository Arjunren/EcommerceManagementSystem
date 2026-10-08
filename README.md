# E-Commerce Management System

## Overview

Northstar Commerce is a secure, responsive operations dashboard for managing products, inventory, customers, and orders. It pairs a polished Next.js interface with validated Node.js route handlers and a PostgreSQL-backed service layer.

## Features

- Responsive commerce dashboard with search, revenue trends, order status, and inventory warnings
- Database-backed login sessions stored in secure, HTTP-only cookies
- Administrator, manager, and staff roles with server-side authorization
- Validated order creation and protected order listing APIs
- Transactional stock deduction that prevents overselling
- PostgreSQL schema, migration, and repeatable development seed
- Unit tests for validation, duplicates, totals, and inventory rules
- Docker and GitHub Actions support

## Technology Stack

- Next.js 16 App Router, React 19, TypeScript 5
- Node.js 24
- PostgreSQL 18
- Prisma ORM 7 with the PostgreSQL driver adapter
- Zod 4, Vitest 5, Lucide React

## Requirements

- Node.js 24 or later and npm 11 or later
- PostgreSQL 16 or later, or Docker Desktop

## Installation

```bash
git clone https://github.com/Arjunren/ecommerce-management-system.git
cd ecommerce-management-system
npm install
cp .env.example .env
```

Update the database URLs in `.env`, then initialize the database.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Runtime PostgreSQL connection URL |
| `DIRECT_URL` | Recommended | Direct connection used by migrations |
| `SESSION_TTL_HOURS` | No | Login lifetime; defaults to 12 hours |

Never commit `.env` or production credentials.

## Database Setup

```bash
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

For production or CI migration application, use `npm run db:deploy`.

## Running the Application

```bash
npm run dev
```

Open `http://localhost:3000`. For a containerized setup, run `docker compose up --build`, apply the migration from the app container, then seed it.

## Running Tests

```bash
npm test
npm run typecheck
npm run build
```

Run the complete verification suite with `npm run check`.

## Default Development Accounts

Development only—change or remove these credentials outside local development:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@commerce.local` | `CommerceDemo!2026` |
| Manager | `manager@commerce.local` | `CommerceDemo!2026` |

## API Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Validate credentials and create a session |
| POST | `/api/auth/logout` | Signed in | Revoke the active session |
| GET | `/api/orders` | Signed in | List all orders for managers/admins or owned orders for staff |
| POST | `/api/orders` | Signed in | Create an order and atomically deduct inventory |

Example order body:

```json
{
  "orderNumber": "ORD-2026",
  "customerId": "customer-id-from-database",
  "items": [{ "productId": "product-id-from-database", "quantity": 2 }]
}
```

## Folder Structure

```text
app/            App Router pages, styling, and API route handlers
components/     Interactive React dashboard components
generated/      Generated Prisma Client (created during install/check)
lib/            Authentication, database, HTTP, password, and validation helpers
prisma/         Schema, SQL migration, and seed script
repositories/   Prisma persistence implementation
services/       Framework-independent business rules
tests/          Vitest unit tests
types/          Domain contracts shared by services and repositories
```

## Security Notes

- Passwords use salted scrypt hashes and timing-safe comparison.
- Raw session tokens are only sent in HTTP-only, same-site cookies; only SHA-256 digests are stored.
- Every order API request authenticates on the server. Role and ownership checks are never delegated to the React client.
- Zod rejects malformed payloads, duplicate product lines, unsafe quantities, and invalid identifiers.
- Prices are loaded from the database rather than trusted from the browser.
- Inventory updates and order writes run in one transaction with conditional stock checks.
- Error responses avoid exposing internal database details. Add rate limiting, audit logging, CSRF origin checks, and managed secret rotation before internet-facing production use.

## Remaining Limitations

- The dashboard uses representative preview data; authenticated API results can be wired to the table after login.
- Payment processing, shipping integrations, refunds, image uploads, and email notifications are outside this starter's scope.
- Production deployments should use a pooled PostgreSQL connection and managed rate limiting.
