const express = require("express");
const { feeConfigurationSpec } = require("../controllers/fee.controller");
const computeTransaction = require("../controllers/transaction.controller");
const {postValidationRule} = require("../validator/validation")
const router = express.Router()

// POST REQUEST TO SETUP FEE CONFIGURATION SPEC
router.post("/fee", feeConfigurationSpec);

// POST REQUEST TO COMPUTE TRANSACTION FEE
router.post("/compute-transaction-fee", postValidationRule(), computeTransaction)


module.exports = router;