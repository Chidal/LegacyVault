import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-nerochain-plugins";
import "@nerochain/hardhat-aa";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "nero_testnet",
  networks: {
    nero_testnet: {
      url: process.env.NERO_TESTNET_PROVIDER_URL,
      chainId: 689,
      accounts: [process.env.PRIVATE_KEY!],
      aaOptions: {
        paymasterUrl: process.env.PAYMASTER_URL,
        entryPoint: process.env.ENTRYPOINT_ADDRESS
      }
    },
    nero_mainnet: {
      url: process.env.NERO_MAINNET_PROVIDER_URL,
      chainId: 12345, // Update with actual mainnet ID
      accounts: [process.env.PRIVATE_KEY!],
      aaOptions: {
        paymasterUrl: "https://paymaster.nerochain.io",
        entryPoint: process.env.ENTRYPOINT_ADDRESS
      }
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
    customChains: [
      {
        network: "nero_testnet",
        chainId: 689,
        urls: {
          apiURL: "https://api-testnet.neroscan.io/api",
          browserURL: "https://testnet.neroscan.io",
        },
      },
      {
        network: "nero_mainnet",
        chainId: 12345, // Update with actual mainnet ID
        urls: {
          apiURL: "https://api.neroscan.io/api",
          browserURL: "https://neroscan.io",
        },
      },
    ],
  },
  nerochain: {
    blockspaceOptimization: true,
    tokenGasOptions: {
      supportedTokens: ["NERO", "USDC", "ETH"]
    }
  },
};

export default config;