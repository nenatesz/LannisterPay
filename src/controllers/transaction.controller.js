const db = require("../../db");

const computeTransaction = async (req, res) => {
    try{
        // GET THE TIME BEFORE COMPUTATION IN MILLISECONDS
        const startTime = new Date().getMilliseconds();

        // GET REQUEST PAYLOAD
        const transactionData = req.body;
        let appliedFeeValue;
        let ChargeAmount;
        let localeType;
        let sql;

        // CHECK IF TRANSACTION IS LOCAL OR INTERNATIONAL
        if (transactionData.PaymentEntity.Country === transactionData.CurrencyCountry){
            localeType = "LOCL"
        }else{
            localeType = "INTL"
        }
    
        // CONFIRM THAT THE TRANSACTION CURRENCY IS IN NAIRA OR ALL(*)
        if(transactionData.Currency !== "NGN" && transactionData.Currency !== "*"){
        return res.status(400).json({
            errors: [
                {
                    msg: "No fee configuration for USD transactions."
                }
            ],
            });
        }

        /**
         * TODO 
         * PROTECT AGAINST SQL INJECTION ATTACK BY BINDING THE PARAMETERS
         */

        // CHECK IF PAYMENT ENTITY TYPE IS A CREDIT-CARD OR DEBIT-CARD AND QUERY THE DATABASE ACCORDINGLY ELSE QUERY THE DATABASE FOR OTHER PROVIDED ENTITY TYPES
        if(transactionData.PaymentEntity.Type === "CREDIT-CARD" || transactionData.PaymentEntity.Type == "DEBIT-CARD"){
        sql = `SELECT * FROM FeeConfigurationSpec WHERE (FeeCurrency = 'NGN' OR FeeCurrency = '*') AND (FeeLocale = ${"'"}${localeType}${"'"} OR FeeLocale = '*') AND (FeeEntity = ${"'"}${transactionData.PaymentEntity.Type}${"'"} OR FeeEntity = '*') AND ((EntityProperty = ${"'"}${transactionData.PaymentEntity.Brand}${"'"} OR EntityProperty = '*') OR (EntityProperty = ${"'"}${transactionData.PaymentEntity.Number}${"'"} OR EntityProperty = '*')) ORDER BY WildcardLen
        LIMIT 1`
        }else{
        sql = `SELECT * FROM FeeConfigurationSpec WHERE (FeeCurrency = 'NGN' OR FeeCurrency = '*') AND (FeeLocale = ${"'"}${localeType}${"'"} OR FeeLocale = '*') AND (FeeEntity = ${"'"}${transactionData.PaymentEntity.Type}${"'"} OR FeeEntity = '*') AND ((EntityProperty = ${"'"}${transactionData.PaymentEntity.Issuer}${"'"} OR EntityProperty = '*') OR (EntityProperty = ${"'"}${transactionData.PaymentEntity.Number}${"'"} OR EntityProperty = '*')) ORDER BY WildcardLen
        LIMIT 1`
        }

        // QUERY THE DATABASE AND RETURN A CALLBACK FUNCTION
        db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        // GET THE FIRST INDEX OF THE RETURNED ARRAY
        const rowObj = rows[0]

        // GET REQUIRED VALUES NEEDED FOR COMPUTATION
        const percent = rowObj.PercentValue;
        const value = rowObj.FlatValue;
        const amount = parseFloat(transactionData.Amount);
        
        // COMPUTE THE TRANSACTION FEE BASED ON THE RETURNED DATA AND COMPUTE THE APPLIED FEE VALUE 
        if(rowObj.FeeType === "FLAT_PERC"){
            appliedFeeValue = Math.round(value + ((percent / 100) * amount));
        }
        else if (rowObj.FeeType === "FLAT"){
            appliedFeeValue = value;
        }
        else if (rowObj.FeeType === "PERC"){
            appliedFeeValue = Math.round((percent * amount) / 100);
        }

        // CHECK IF THE CUSTOMER BEARS THE TRANSACTION FEE AND CALCULATE CHARGE AMOUNT
        if(transactionData.Customer.BearsFee === true){
            ChargeAmount = amount + appliedFeeValue;
        }else{
            ChargeAmount = amount; 
        }

        // CALCULATE THE SETTLEMENT AMOUNT
        const SettlementAmount = ChargeAmount - appliedFeeValue;

        // GET THE TIME AFTER COMPUTATION IN MILLISECONDS
        const endTime = new Date().getMilliseconds();
        // GET TIME DIFFERNCE
        const timeDifference = `${endTime - startTime}ms`

        // RETURN SUCCESS RESPONSE
        return res.status(200).json({responseMessage:{
            AppliedFeeID: rowObj.FeeID,
            AppliedFeeValue: appliedFeeValue,
            ChargeAmount: ChargeAmount,
            SettlementAmount: SettlementAmount
        }, responseTime: timeDifference})
        });
}catch(error){
    return res.status(400).json({
        errors: [
            {
                msg: "An Error Occurred While Computing Transaction Fees"
            }
        ],
        });
}
};

module.exports = computeTransaction;
 