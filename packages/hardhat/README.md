# NERO Chain Composer | Hardhat (AA-Enabled)

## How to Use

### 1. Environment Setup
```bash
# Copy and configure the environment file
cp .env.example .env
```

### 2. Required Environment Variables
```bash
# For deployment
PRIVATE_KEY="your_wallet_private_key"

# For AA features
PAYMASTER_URL="https://paymaster-testnet.nerochain.io"
ENTRYPOINT_ADDRESS="0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
FEE_TOKEN="0xNEROTokenAddress"  # NERO's native token address

# For verification
NEROSCAN_API_KEY="your_api_key_from_neroscan"
```

### 3. Deployment Commands

#### Testnet Deployment (with AA)
```bash
# Standard deployment
npx hardhat run scripts/deploy.js --network nero_testnet

# AA-enabled deployment
npx hardhat run scripts/deployWithAA.js --network nero_testnet
```

#### Mainnet Deployment (with AA)
```bash
# Gasless deployment using Paymaster
npx hardhat run scripts/deployWithAA.js --network nero_mainnet \
  --paymaster-policy "LEGACY_VAULT" \
  --fee-token $FEE_TOKEN
```

### 4. Verification

#### Testnet Verification
```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] \
  --network nero_testnet \
  --custom-chain nero_testnet
```

#### Mainnet Verification
```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] \
  --network nero_mainnet \
  --custom-chain nero_mainnet
```

### 5. Key Configuration Files

#### `hardhat.config.js` Highlights
```javascript
module.exports = {
  networks: {
    nero_testnet: {
      url: "https://rpc-testnet.nerochain.io",
      chainId: 689,
      accounts: [process.env.PRIVATE_KEY],
      aaOptions: {
        paymasterUrl: process.env.PAYMASTER_URL,
        entryPoint: process.env.ENTRYPOINT_ADDRESS
      }
    }
  },
  etherscan: {
    apiKey: process.env.NEROSCAN_API_KEY,
    customChains: [{
      network: "nero_testnet",
      chainId: 689,
      urls: {
        apiURL: "https://api-testnet.neroscan.io/api",
        browserURL: "https://testnet.neroscan.io"
      }
    }]
  }
};
```

## AA-Specific Features

### Paymaster Policies
Configure in `paymasterPolicies.js`:
```javascript
module.exports = {
  LEGACY_VAULT: {
    rules: {
      maxValue: "1.0", // Max 1 NERO token
      allowedMethods: ["withdraw", "createLegacyPlan"]
    }
  }
};
```

### Token-as-Gas Options
Enable in deployment scripts:
```javascript
await deployAA("ContractName", {
  paymasterConfig: {
    feeToken: process.env.FEE_TOKEN,
    sponsorship: "partial" // 50% sponsored
  }
});
```

## Troubleshooting

### Common Issues

1. **Paymaster Errors**:
   ```bash
   # Check Paymaster status
   curl $PAYMASTER_URL/health
   ```

2. **Verification Failed**:
   ```bash
   # Retry with explicit constructor args
   npx hardhat verify --constructor-args arguments.js DEPLOYED_ADDRESS
   ```

3. **AA Transaction Reverts**:
   ```bash
   # Debug with full traces
   NODE_OPTIONS="--max-old-space-size=4096" npx hardhat test --trace
   ```

## Additional Resources

- [NERO AA Documentation](https://docs.nerochain.io/account-abstraction)
- [NEROScan Explorer](https://testnet.neroscan.io)
- [Testnet Faucet](https://faucet.nerochain.io)


