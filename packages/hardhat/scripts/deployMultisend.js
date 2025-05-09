const hre = require("hardhat");
const { deployAA } = require("@nerochain/hardhat-aa");

async function main() {
  console.log("Deploying MultiSend with AA support...");

  // AA-enabled deployment with gas sponsorship
  const multisend = await deployAA(
    "MultiSend",
    {
      paymasterConfig: {
        sponsorshipPolicy: "BATCH_TRANSFER", 
        gasLimit: "5000000" // Higher gas limit for batch ops
      }
    }
  );

  console.log(`
    MultiSend deployed with AA features:
    - Address: ${multisend.address}
    - Paymaster Policy: BATCH_TRANSFER
    - Gas Limit: 5,000,000
  `);

  // Optional: Verify on NERO Scan
  if (hre.network.name !== "hardhat") {
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: multisend.address,
      constructorArguments: [],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});