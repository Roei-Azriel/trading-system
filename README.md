# TradeForge Backend

TradeForge Backend is a microservice-style Node.js backend for a crypto trading platform. It currently covers user creation, wallet management, and order lifecycle basics, with PostgreSQL and Prisma as the persistence layer.

The architecture is being built in stages: the current services already expose useful APIs and include wallet locking logic for order placement, while the matching engine, websocket distribution, and Redis-based real-time infrastructure are planned next.

## Current Status

- `user-service` can create users, delete users, and change passwords.
- `wallet-service` can create wallets and manage balances.
- `order-service` can create buy and sell orders and cancel open orders.
- PostgreSQL is available through Docker Compose.
- Prisma schema, migrations, and ERD generation are already present.
- Matching and trade execution are not implemented yet.

## Architecture

The backend is currently split into three services:

- `user-service` on port `30001`
- `order-service` on port `30002`
- `wallet-service` on port `30003`

Each service follows a layered structure:

- route
- controller
- service
- repository
- Prisma persistence

The services communicate over HTTP where needed. For example:

- user creation triggers wallet creation in the wallet service
- order creation queries wallet ownership and locks balances before opening orders

## Tech Stack

- Node.js
- TypeScript
- Express 5
- Prisma ORM
- PostgreSQL
- Zod
- bcryptjs
- Docker Compose

## Database Model

The Prisma schema already models the main trading entities:

- `User`
- `Wallet`
- `WalletBalance`
- `Order`
- `Trade`

Enums are already defined for:

- currencies
- supported pairs
- order side
- order status

At the moment, the schema is ahead of the execution engine: `Trade` and advanced order states exist in the model, but the matching flow that produces them is still in progress.

## Services

### user-service

Base route: `/user`

Implemented endpoints:

- `POST /user/new-user`
- `DELETE /user/:id`
- `POST /user/:id/password`
- `GET /healthz`

Current responsibilities:

- validate user input with Zod
- hash passwords with bcrypt
- enforce uniqueness for email, username, and ID number
- trigger wallet creation after successful user creation

### wallet-service

Base route: `/wallet`

Implemented endpoints:

- `POST /wallet/:userId/createWallet`
- `GET /wallet/:userId/balances`
- `POST /wallet/:userId/credit`
- `POST /wallet/:userId/debit`
- `GET /wallet/:userId/getWallet`
- `GET /healthz`

Current responsibilities:

- create a wallet for a user
- store balances per currency
- credit available funds
- debit available funds with transaction safety
- return wallet balances for upstream services

### order-service

Base route: `/order`

Implemented endpoints:

- `POST /order/:userId/orders`
- `POST /order/:userId/orders/:id/cancel`
- `GET /healthz`

Current responsibilities:

- validate new order requests
- create buy and sell orders
- lock quote/base assets depending on order side
- cancel open orders
- unlock remaining funds when orders are cancelled

## Local Development

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop or a local Docker engine

### Start PostgreSQL

From the `backend` directory:

```bash
docker compose up -d
```

This starts PostgreSQL on port `5433`.

### Install dependencies

Install dependencies inside each service directory:

```bash
cd services/user-service
npm install

cd ../wallet-service
npm install

cd ../order-service
npm install
```

### Environment Variables

Each service expects at least:

```env
PORT=30001
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trading?schema=public
JWT_SECRET=change-me
```

Adjust `PORT` per service:

- user-service: `30001`
- order-service: `30002`
- wallet-service: `30003`

### Run services

You can start services manually:

```bash
npm run dev
```

Or use the helper script from the `backend` root:

```powershell
.\start-dev.ps1
```

## Project Structure

```text
backend/
  docker-compose.yml
  start-dev.ps1
  services/
    user-service/
    wallet-service/
    order-service/
  shared/
```

Each service contains:

```text
src/
  app.ts
  server.ts
  config/
  common/
  modules/
    <domain>/
prisma/
  schema.prisma
  migrations/
```

## What Is Already Working

- modular service boundaries
- input validation with Zod
- password hashing
- wallet auto-creation on signup
- wallet credit and debit operations
- order creation with funds locking
- order cancellation with funds unlock
- shared trading schema across services

## Known Gaps

- no API gateway is wired and documented yet
- no authentication tokens or session flow yet
- no matching engine
- no trade settlement execution
- no websocket broadcasting
- no Redis integration yet
- no automated test suite yet

## Next Steps

- build the matching engine
- introduce Redis for pub/sub, queueing, and market event fan-out
- add websocket infrastructure for live order book and market trades
- settle matched trades and update balances automatically
- expose market depth and recent trades endpoints
- add authentication and authorization flow
- add an API gateway for routing and consolidation
- add integration tests for service-to-service behavior

## Goal of This Backend

This backend is designed as a serious learning and portfolio project focused on real trading-system concepts:

- service boundaries
- balance locking and unlock flows
- transactional correctness around orders
- database modeling for trading entities
- readiness for real-time exchange infrastructure
