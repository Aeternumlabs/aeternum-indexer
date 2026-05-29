import { ponder } from "ponder:registry";
import schema from "ponder:schema";

// Index the initial creation of vaults
ponder.on("AeternumVault:VaultRegistered", async ({ event, context }) => {
  await context.db.insert(schema.vaults).values({
    id: event.args.owner,
    backupAddress: event.args.backup,
    inactivityPeriod: event.args.period,
    createdAt: Number(event.block.timestamp),
  });
});

// Index every individual inbound deposit entry
ponder.on("AeternumVault:Deposit", async ({ event, context }) => {
  await context.db.insert(schema.deposits).values({
    id: event.log.id,
    vaultId: event.args.wallet,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });
});