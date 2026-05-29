import { createConfig } from "ponder";
import { AETERNUM_VAULT_ABI } from "./abis/AeternumVault";

export default createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: process.env.ALCHEMY_RPC_URL,
    },
  },
  contracts: {
    AeternumVault: {
      abi: AETERNUM_VAULT_ABI,
      chain: "sepolia",
      // Set dynamically via env or fallback to your hardcoded testnet address
      address: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: 5000000, // Replace with the precise block number your contract was deployed on
    },
  },
});