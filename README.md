# Aeternum Indexer

This is an on-chain indexer for the `AeternumVault` smart contract. It listens for vault lifecycle events, stores normalized state in a Postgres-compatible database, and exposes GraphQL plus REST query endpoints.

## Features

- Indexes `AeternumVault` contract events on Sepolia
- Stores vault state, transaction history, and recovery lifecycle events
- Exposes an auto-generated GraphQL API
- Provides a custom REST endpoint at `/vault-count`
- Supports environment-driven RPC and contract address configuration

## Repository structure

```
aeternum-indexer/
├── .env.local                 # local environment variables
├── .gitignore                 # ignored files
├── package.json               # scripts and dependencies
├── tsconfig.json              # TypeScript configuration
├── ponder.config.ts           # Ponder chain + contract configuration
├── ponder.schema.ts           # database schema definitions
├── abis/                      # contract ABIs
│   └── AeternumVault.ts       # AeternumVault ABI export
├── src/                       # source code
│   ├── index.ts               # Ponder event handlers
│   └── api/                   # API entrypoint
│       └── index.ts
└── generated/                 # Ponder-generated artifacts
```

## Requirements

- Node.js
- `pnpm`
- PostgreSQL-compatible database
- Sepolia RPC endpoint

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` in the repo root with:

```bash
DRPC_URL=<your_sepolia_rpc_url>
NEXT_PUBLIC_VAULT_ADDRESS=<AeternumVault_contract_address>
```

3. Start the indexer:

```bash
pnpm dev
```

## Scripts

- `pnpm dev` — run the indexer locally
- `pnpm start` — start the Ponder application
- `pnpm codegen` — generate schema/type artifacts

## Configuration

- `ponder.config.ts` configures Sepolia:
  - chain ID `11155111`
  - RPC via `DRPC_URL`
  - max 10 requests/sec
  - logs fetched in blocks of `1000`
- The `AeternumVault` contract address is set from `NEXT_PUBLIC_VAULT_ADDRESS`
- Indexing starts from block `10862194`

## Schema

- `vaults` — vault registration and state metadata
- `vault_transactions` — deposits, withdrawals, transfers
- `recovery_events` — executed, failed, abandoned, cancelled recoveries

## API

The GraphQL API is exposed at:

- `/`
- `/graphql`

Custom REST endpoint:

- `/vault-count`

Example response:

```json
{
  "success": true,
  "totalVaults": 42
}
```

## Notes

- `src/index.ts` contains the core Ponder event handlers.
- `src/api/index.ts` mounts the GraphQL API and a simple REST health endpoint.
- The database schema is defined in `ponder.schema.ts` using Ponder's `onchainTable` helper.
