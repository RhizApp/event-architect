# The Rhiz App Standard Stack (RASS)

This document defines the **standardized architecture, technology stack, and implementation workflow** for all applications in the `RhizApp` ecosystem (e.g., `rhiz-event-maker`, `FundRhiz`, `werhiz-identity`).

> **Core Philosophy**: Enable **Data Portability** (User-owned identity) while maintaining **High Performance** (Sub-second UI) and **Developer Velocity** (Standardized tooling).

---

## 🏗️ Architecture Overview

The "Rhiz App Standard Stack" enforces a strict strict separation of concerns between **Application State** and **Network State**.

### 1. The Global Graph Layer (Network State)

- **Infrastructure**: Rhiz Protocol (Managed API/SDK)
- **Database**: Protocol Postgres + Vector Store (Global Context)
- **Core Concepts**:
  - **Graph**: People, Relationships, Trust Scores, Context Tags.
  - **Privacy**: Zero-Knowledge (ZK) Verification for private assertions.
  - **Intelligence**: NLP & Agents for semantic understanding.
- **Access**: **STRICTLY via SDK** (`@rhiz/protocol-client`).
- **Why**: Ensures no single app "owns" the user's identity graph. It is a shared, portable resource.

### 2. The Application Layer (Application State)

- **Framework**: **Next.js 16+** (App Router, Server Actions)
- **Database**: **Vercel Postgres** (Neon)
- **ORM**: **Drizzle ORM**
- **Role**: Stores app-specific ephemeral or UI state (e.g., Drafts, Preferences, Logs, Transactions).
- **Access**: Direct SQL access via Server Actions (secure, typed).
- **Why**: Provides sub-second latency, type safety, and zero-maintenance scaling.

### 3. The Identity Layer (Authentication)

- **Provider**: **Clerk**
- **Role**: Handles Authentication, Session Management, and Multi-Tenancy (Organizations).
- **Integration**: The generic `auth_user_id` (Clerk) is mapped to a canonical `rhiz_person_id` (Protocol) to link the user to the graph.

---

## �️ Technology Stack Specification

All new Rhiz applications must adhere to these versions (or newer):

| Layer          | Technology      | Version    | Notes                                      |
| :------------- | :-------------- | :--------- | :----------------------------------------- |
| **Framework**  | Next.js         | **16.x**   | Use App Router & Server Components.        |
| **Language**   | TypeScript      | **5.x**    | Strict mode enabled.                       |
| **UI Library** | React           | **19.x**   | Utilization of new hooks/primitives.       |
| **Styling**    | Tailwind CSS    | **4.x**    | Utility-first, standardized design tokens. |
| **Database**   | Vercel Postgres | -          | Serverless SQL.                            |
| **ORM**        | Drizzle         | **Latest** | Lightweight, typed SQL builder.            |
| **Auth**       | Clerk           | **Latest** | Seamless middleware integration.           |
| **Animation**  | Framer Motion   | **Latest** | Standard for micro-interactions.           |
| **Protocol**   | Rhiz SDK        | **v0.2+**  | API Client + ZK Utilities.                 |

---

## 🚀 Implementation Workflow

Follow this checklist when spinning up or upgrading a Rhiz App.

### Phase 1: Infrastructure Setup

1.  **Initialize**:

    - `npx create-next-app@latest` (App Router, TypeScript, Tailwind).
    - Install core dependencies:
      ```bash
      npm install drizzle-orm @vercel/postgres dotenv @clerk/nextjs lucide-react clsx tailwind-merge framer-motion
      npm install -D drizzle-kit
      ```

2.  **Environment Configuration**:
    - Set up `.env` with:
      - `POSTGRES_URL` (Vercel Postgres)
      - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
      - `RHIZ_PROTOCOL_API_KEY` & `RHIZ_PROTOCOL_URL`

### Phase 2: Data Layer (Drizzle)

1.  **Schema Definition (`lib/db/schema.ts`)**:

    - Define tables for local app state.
    - **Crucial**: Always include `owner_id` (Clerk ID) or `rhiz_id` (Protocol ID) to link records.

    ```typescript
    // Example
    export const events = pgTable("events", {
      id: serial("id").primaryKey(),
      ownerId: text("owner_id").notNull(), // Links to Clerk
      protocolId: text("protocol_id"), // Links to Rhiz Graph
      title: text("title").notNull(),
    });
    ```

2.  **Drizzle Config (`drizzle.config.ts`)**:

    - Configure to read `schema.ts` and output migrations to `drizzle`.

3.  **Migration Workflow**:
    - `npx drizzle-kit push` (Prototyping)
    - `npx drizzle-kit generate` + `migrate()` (Production)

### Phase 3: The "Wiring" (Sync Pattern)

The most critical pattern in RASS is the **Dual-Write Sync**:

1.  **Initialize Client**:

    - Instantiate `RhizClient` in a server-only module (`lib/protocol.ts`).

2.  **Sync Action**:
    - When a significant business action happens (e.g., "User joins Event"), perform:
      1.  **Local Write**: Update App DB for immediate UI reflection.
      2.  **Protocol Turn**: Call `rhizClient.ingestInteraction(...)` or `rhizClient.people.update(...)` to semanticize the data for the global graph.

### Phase 4: Privacy & Verification (ZK)

- **Zero-Knowledge Proofs**: Use `rhizClient.zk` for verifying assertions without revealing underlying data (e.g., "User is over 18" or "User attended event X").
- **Private Data**: Store sensitive personal data _only_ in the user's encrypted data vault (Protocol), not in the App DB in plaintext.

---

## 🤖 Future Roadmap: `create-rhiz-app`

We aim to build a CLI tool (`npx create-rhiz-app`) that automates this entire setup:

1.  Scaffolding the Next.js 16 + Tailwind 4 structure.
2.  Provisioning Vercel Postgres & Clerk via APIs.
3.  Pre-installing the Drizzle + Rhiz SDK boilerplate.
