# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### AgriGuard AI (`artifacts/agriguard-ai`)
- **Type**: React + Vite web app
- **Preview path**: `/`
- **Description**: Agricultural intelligence dashboard for farmers

**Features:**
- Crop Prediction (temperature, humidity, pH, rainfall → ML/rule-based prediction)
- Risk Assessment (Low/Medium/High badges)
- Explainable AI (reasoning behind predictions)
- Disease Detection (image upload + simulated detection)
- Financial Insights (cost vs profit analysis with charts using Recharts)
- 3D Plant Viewer (Three.js with CSS fallback for headless environments)
- Indian Government Subsidies (PM-KISAN, PMFBY, PMKSY, KCC, SMAM, etc.)

**Routes:**
- `/` — Dashboard
- `/predict` — Crop prediction form
- `/result` — Prediction results
- `/disease` — Disease detection (image upload)
- `/finance` — Financial analysis
- `/subsidies` — Government schemes

**Key dependencies added:** `three`, `@types/three`

### API Server (`artifacts/api-server`)
- **Type**: Express 5 API
- **Preview path**: `/api`

**Endpoints:**
- `GET /api/healthz` — Health check
- `POST /api/crop/predict` — Crop prediction (rule-based ML)
- `GET /api/crop/history` — Prediction history
- `POST /api/disease/detect` — Disease detection (simulation)
- `POST /api/finance/analyze` — Financial analysis
- `GET /api/subsidies` — Indian government subsidies list

**Note:** The api-server uses `zod` (not `zod/v4`) to avoid esbuild resolution issues.
