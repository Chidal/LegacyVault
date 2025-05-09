import { expect } from "chai";
import { createAAUserOp } from "@nerochain/hardhat-aa";

describe("LegacyVault AA Tests", function () {
  it("Should execute AA transaction", async function () {
    const LegacyVault = await ethers.getContractFactory("LegacyVault");
    const vault = await LegacyVault.deploy();
    
    const [owner] = await ethers.getSigners();
    
    const userOp = await createAAUserOp(owner, {
      target: vault.address,
      data: vault.interface.encodeFunctionData("setLegacyPlan", [...]),
      paymaster: true
    });
    
    await expect(vault.processUserOp(userOp))
      .to.emit(vault, "LegacyPlanCreated");
  });
});