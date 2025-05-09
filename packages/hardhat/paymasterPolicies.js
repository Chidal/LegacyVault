module.exports = {
  TIME_LOCK: {
    rules: {
      maxValue: "0.001", // Max 0.001 NERO
      allowedFunctions: ["withdraw"]
    }
  },
  BATCH_TRANSFER: {
    rules: {
      maxOperations: 100,
      feeToken: "0x43E55608892989c43366CCd07753ce49e0c17688"
    }
  }
};