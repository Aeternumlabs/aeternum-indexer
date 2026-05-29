import { onchainTable } from "ponder";

export const vaults = onchainTable("vaults", (t) => ({
  id: t.hex().primaryKey(), // The user's primary smart account/vault address
  backupAddress: t.hex().notNull(),
  inactivityPeriod: t.bigint().notNull(),
  createdAt: t.integer().notNull(),
}));

export const deposits = onchainTable("deposits", (t) => ({
  id: t.text().primaryKey(), // Unique combination of Tx Hash + Log Index
  vaultId: t.hex().notNull(),
  amount: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
}));