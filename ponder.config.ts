/**
 * ponder.config.ts
 *
 * Network and indexing configuration for the Aeternum protocol.
 * Defines RPC endpoints, sync throttling limits, and contract event 
 * tracking targets for the Ethereum Sepolia testnet.
 */

import { createConfig } from "ponder";
import { AETERNUM_VAULT_ABI } from "./abis/AeternumVault";

export default createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: process.env.DRPC_URL,
      maxRequestsPerSecond: 10,
      // Force Ponder to fetch logs in smaller chunks to avoid payload timeouts
      ethGetLogsBlockRange: 1000, 
    },
  },
  contracts: {
    AeternumVault: {
      abi: AETERNUM_VAULT_ABI,
      chain: "sepolia",
      // Set dynamically via env or fallback to your hardcoded testnet address
      address: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: 10862194,
    },
  },
});