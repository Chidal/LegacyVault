const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { createAAUserOp } = require("@nerochain/hardhat-aa");

describe("Lock (AA-enabled)", function () {
  // Updated fixture with AA support
  async function deployAALockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_NERO = ethers.utils.parseUnits("1", 18); // Using NERO tokens instead of ETH

    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const [owner, otherAccount] = await ethers.getSigners();

    // AA-enabled deployment
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { 
      value: ONE_NERO,
      aaOptions: {
        paymaster: true,
        feeToken: "0x43E55608892989c43366CCd07753ce49e0c17688" // Replace with actual NERO token address
      }
    });

    return { lock, unlockTime, lockedAmount: ONE_NERO, owner, otherAccount };
  }

  // Helper for AA withdrawals
  async function createWithdrawUserOp(lock, signer) {
    return createAAUserOp(signer, {
      target: lock.address,
      data: lock.interface.encodeFunctionData("withdraw"),
      paymaster: true
    });
  }

  describe("AA Deployment", function () {
    it("Should deploy with AA support", async function () {
      const { lock } = await loadFixture(deployAALockFixture);
      expect(await lock.isAACapable()).to.be.true;
    });

    it("Should accept NERO tokens as fee payment", async function () {
      const { lock } = await loadFixture(deployAALockFixture);
      expect(await lock.feeToken()).to.equal("0xNEROTokenAddress");
    });
  });

  describe("AA Withdrawals", function () {
    it("Should process AA withdrawal after unlock time", async function () {
      const { lock, unlockTime, owner } = await loadFixture(deployAALockFixture);
      await time.increaseTo(unlockTime);
      
      const userOp = await createWithdrawUserOp(lock, owner);
      await expect(lock.processUserOp(userOp))
        .to.emit(lock, "Withdrawal")
        .withArgs(anyValue, anyValue);
    });

    it("Should reject AA withdrawal before unlock time", async function () {
      const { lock, owner } = await loadFixture(deployAALockFixture);
      const userOp = await createWithdrawUserOp(lock, owner);
      
      await expect(lock.processUserOp(userOp))
        .to.be.revertedWith("You can't withdraw yet");
    });

    it("Should reject AA withdrawal from non-owner", async function () {
      const { lock, unlockTime, otherAccount } = await loadFixture(deployAALockFixture);
      await time.increaseTo(unlockTime);
      
      const userOp = await createWithdrawUserOp(lock, otherAccount);
      await expect(lock.processUserOp(userOp))
        .to.be.revertedWith("You aren't the owner");
    });

    it("Should transfer funds via AA operation", async function () {
      const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployAALockFixture);
      await time.increaseTo(unlockTime);
      
      const initialBalance = await ethers.provider.getBalance(lock.address);
      const userOp = await createWithdrawUserOp(lock, owner);
      
      await expect(() => lock.processUserOp(userOp))
        .to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
    });
  });

  // Maintain original tests for non-AA functionality
  describe("Standard Functionality", function () {
    it("Should maintain original non-AA features", async function () {
      const { lock, unlockTime } = await loadFixture(deployAALockFixture);
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });
  });
});