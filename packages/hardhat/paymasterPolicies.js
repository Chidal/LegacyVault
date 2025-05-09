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
      feeToken: "0xNEROTokenAddress"
    }
  }
};