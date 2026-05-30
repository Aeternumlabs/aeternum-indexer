/**
 * ponder.schema.ts
 *
 * Database schema definition for the Aeternum protocol indexer.
 * Establishes the relational structure for core vault states, financial
 * ledgers, and the automated recovery lifecycle.
 */

import { onchainTable } from "ponder";

// 1. Core Vault Entity
export const vaults = onchainTable("vaults", (t) => ({
  id: t.text().primaryKey(), // The wallet address
  backupAddress: t.text().notNull(),
  inactivityPeriod: t.bigint().notNull(),
  lastActivityTimestamp: t.bigint().notNull(),
  isRecovered: t.boolean().notNull().default(false),
  isAbandoned: t.boolean().notNull().default(false),
  createdAtBlock: t.bigint().notNull(),
}));

// 2. Unified Vault Transactions Log
// Handles BOTH financial events (Deposits/Sends) AND lifecycle events (Pings/Recovery)
export const vaultTransactions = onchainTable("vault_transactions", (t) => ({
  id: t.text().primaryKey(), // unique hash + log index
  wallet: t.text().notNull(),
  type: t.text().notNull(), // "DEPOSIT", "WITHDRAWAL", "SENT", "PING", "REGISTERED", "RECOVERY_EXECUTED", etc.
  
  // These fields are nullable because a "PING" has no amount or toAddress
  amount: t.bigint(), 
  toAddress: t.text(), // Renamed from 'recipient' to match frontend GraphQL

  // New fields required by the frontend UI
  transactionHash: t.text().notNull(), 
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

// 3. Unified Balance Ledger (For Charting)
export const balanceEvents = onchainTable("balance_events", (t) => ({
  id: t.text().primaryKey(), // unique hash + log index
  vaultId: t.text().notNull(), // The wallet address, named to match GraphQL query
  eventName: t.text().notNull(), // "Deposited", "Sent", "Withdrawn", "RecoveryExecuted", "RecoveryCancelled"
  blockNumber: t.bigint().notNull(),
  logIndex: t.integer().notNull(),
  blockTimestamp: t.bigint().notNull(),
  amount: t.bigint(), // Nullable for events that wipe the balance without a specific delta
}));