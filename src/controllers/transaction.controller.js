const db = require("../../db");

const computeTransaction = async (req, res) => {
    // GET REQUEST PAYLOAD
    const transactionData = req.body;
    console.log(transactionData);
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

    console.log("Locale", localeType)

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

    // CHECK IF PAYMENT ENTITY TYPE IS A CREDIT-CARD OR DEBIT-CARD AND QUERY THE DATABASE ACCORDINGLY
    if(transactionData.PaymentEntity.Type === "CREDIT-CARD" || transactionData.PaymentEntity.Type == "DEBIT-CARD"){
    sql = `SELECT * FROM FeeConfigurationSpec WHERE (FeeCurrency = 'NGN' OR FeeCurrency = '*') AND (FeeLocale = ${"'"}${localeType}${"'"} OR FeeLocale = '*') AND (FeeEntity = ${"'"}${transactionData.PaymentEntity.Type}${"'"} OR FeeEntity = '*') AND ((EntityProperty = ${"'"}${transactionData.PaymentEntity.Brand}${"'"} OR EntityProperty = '*') OR (EntityProperty = ${"'"}${transactionData.PaymentEntity.Number}${"'"} OR EntityProperty = '*')) ORDER BY WildcardLen
    LIMIT 1`
    }else{
    sql = `SELECT * FROM FeeConfigurationSpec WHERE (FeeCurrency = 'NGN' OR FeeCurrency = '*') AND (FeeLocale = ${"'"}${localeType}${"'"} OR FeeLocale = '*') AND (FeeEntity = ${"'"}${transactionData.PaymentEntity.Type}${"'"} OR FeeEntity = '*') AND ((EntityProperty = ${"'"}${transactionData.PaymentEntity.Issuer}${"'"} OR EntityProperty = '*') OR (EntityProperty = ${"'"}${transactionData.PaymentEntity.Number}${"'"} OR EntityProperty = '*')) ORDER BY WildcardLen
    LIMIT 1`
    }

    // QUERY THE DATABASE
    db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    const rowObj = rows[0]
    console.log(rowObj);
    if(rowObj.FeeType === "FLAT_PERC"){
        console.log("FLAT_PERC");
        const percent = rowObj.PercentValue
        const value = rowObj.FlatValue
        console.log(percent, value);
        // 140 + ((1.4 / 100) * 1500)
        appliedFeeValue = Math.round((value) + ((percent) / 100) * parseFloat(transactionData.Amount));
        console.log('flat_perc', appliedFeeValue)
    }
    else if (rowObj.FeeType === "FLAT"){
        const value = rowObj.FlatValue
        appliedFeeValue = value;
        console.log('flat', appliedFeeValue)
    }
    else if (rowObj.FeeType === "PERC"){
        const percent = rowObj.PercentValue
        // ((fee value * transaction amount ) / 100)
        appliedFeeValue = Math.round((percent * parseFloat(transactionData.Amount)) / 100)
        console.log('perc', appliedFeeValue);
    }
    
    if(transactionData.Customer.BearsFee === true){
            ChargeAmount = Math.round((parseFloat(transactionData.Amount) + appliedFeeValue));
    }else{
            ChargeAmount = Math.round(parseFloat(transactionData.Amount))
    }

    const SettlementAmount = ChargeAmount - appliedFeeValue

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({
        AppliedFeeID: rowObj.FeeID,
        AppliedFeeValue: appliedFeeValue,
        ChargeAmount: ChargeAmount,
        SettlementAmount: SettlementAmount
    })

    });

};

module.exports = computeTransaction;
 
