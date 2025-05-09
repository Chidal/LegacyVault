const hre = require("hardhat");
const { deployAA } = require("@nerochain/hardhat-aa");

async function main() {
  const currentTimestamp = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestamp + 60; // 60 seconds from now
  
  const lockedAmount = hre.ethers.utils.parseUnits("0.0001", 18); 
  const feeToken = "0x43E55608892989c43366CCd07753ce49e0c17688"; 
  console.log(`Deploying Lock with AA support...`);

  // AA-enabled deployment
  const lock = await deployAA(
    "Lock",
    {
      args: [unlockTime],
      paymasterConfig: {
        sponsorshipPolicy: "TIME_LOCK", 
        feeToken: feeToken
      },
      value: lockedAmount
    }
  );

  console.log(`
    Lock deployed with AA features:
    - Address: ${lock.address}
    - Unlock Time: ${unlockTime}
    - Fee Token: ${feeToken}
    - Paymaster Policy: TIME_LOCK
  `);

  // Optional: Verify on NERO Scan
  if (hre.network.name !== "hardhat") {
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: lock.address,
      constructorArguments: [unlockTime],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});