/**
 * src/index.ts
 *
 * Core event mapping logic for the AeternumVault smart contract.
 * Listens for all 11 state-changing events and routes on-chain data directly
 * into the PostgreSQL tables defined in ponder.schema.ts.
 */

import { ponder } from "ponder:registry";
import schema from "ponder:schema";

// --- 1. REGISTRATION ---
ponder.on("AeternumVault:RecoveryRegistered", async ({ event, context }) => {
  await context.db.insert(schema.vaults).values({
    id: event.args.wallet,
    backupAddress: event.args.backupAddress,
    inactivityPeriod: event.args.inactivityPeriod,
    lastActivityTimestamp: event.block.timestamp,
    isRecovered: false,
    isAbandoned: false,
    createdAtBlock: event.block.number,
  });
});

// --- 2. ACTIVITY & CONFIG UPDATES ---
ponder.on("AeternumVault:ActivityPinged", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    lastActivityTimestamp: event.args.timestamp,
  });
});

ponder.on("AeternumVault:BackupAddressUpdated", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    backupAddress: event.args.newBackupAddress,
    lastActivityTimestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:InactivityPeriodUpdated", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    inactivityPeriod: event.args.newPeriod,
    lastActivityTimestamp: event.block.timestamp,
  });
});

// --- 3. FINANCIAL TRANSACTIONS ---
ponder.on("AeternumVault:Deposited", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    lastActivityTimestamp: event.block.timestamp,
  });

  await context.db.insert(schema.vaultTransactions).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "DEPOSIT",
    amount: event.args.amount,
    timestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:Sent", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    lastActivityTimestamp: event.block.timestamp,
  });

  await context.db.insert(schema.vaultTransactions).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "SENT",
    amount: event.args.amount,
    recipient: event.args.to,
    timestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:Withdrawn", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    lastActivityTimestamp: event.block.timestamp,
  });

  await context.db.insert(schema.vaultTransactions).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "WITHDRAWAL",
    amount: event.args.amount,
    timestamp: event.block.timestamp,
  });
});

// --- 4. RECOVERY LIFECYCLE ---
ponder.on("AeternumVault:RecoveryExecuted", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    isRecovered: true,
  });

  await context.db.insert(schema.recoveryEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "EXECUTED",
    backupAddress: event.args.backupAddress,
    amount: event.args.amount,
    timestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:RecoveryFailed", async ({ event, context }) => {
  await context.db.insert(schema.recoveryEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "FAILED",
    backupAddress: event.args.backupAddress,
    amount: event.args.amount,
    timestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:RecoveryAbandoned", async ({ event, context }) => {
  await context.db.update(schema.vaults, { id: event.args.wallet }).set({
    isAbandoned: true,
  });

  await context.db.insert(schema.recoveryEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "ABANDONED",
    backupAddress: event.args.backupAddress,
    amount: event.args.balance,
    timestamp: event.block.timestamp,
  });
});

ponder.on("AeternumVault:RecoveryCancelled", async ({ event, context }) => {
  await context.db.insert(schema.recoveryEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    wallet: event.args.wallet,
    type: "CANCELLED",
    amount: event.args.refundAmount,
    timestamp: event.block.timestamp,
  });
});