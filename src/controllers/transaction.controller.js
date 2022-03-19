const FeeConfigurationSpec = require("../models/fee.model");
const Transaction = require("../models/transaction.model");
// const _ = require("lodash");

// IMPORT EXPRESS VALIDATOR AND CHECK FOR STRING 


const computeTransaction = async (req, res) => {
    const feeConfig = await FeeConfigurationSpec.find({}).lean();
    const feeArr = [...feeConfig]
    const transactionData = req.body;
    // console.log(feeConfig);
    let transaction = {};
    let appliedFeeValue;
    let minArr;
    let ChargeAmount;
    let getData;

    console.log('data', transactionData.PaymentEntity)

/**
 * get feeLocale
 * 
 */ let localeType
    if (transactionData.PaymentEntity.Country === transactionData.CurrencyCountry){
        localeType = "LOCL"
    }else{
        localeType = "INTL"
    }

    console.log("Locale", localeType)
    const getTransactionData = await FeeConfigurationSpec.find({}).lean()

    const max = getTransactionData.reduce((prev, curr) => {
         return prev.WildcardLen > curr.WildcardLen ? prev : curr;
         }, 0)
         const maxLen = max.WildcardLen
         console.log("MAX", max.WildcardLen)

         if(transactionData.Currency !== "NGN" && transactionData.Currency !== "*"){
            return res.status(400).json({
                errors: [
                    {
                        msg: "No fee configuration for USD transactions."
                    }
                ],
              });
         }

         if(transactionData.PaymentEntity.Type === "CREDIT-CARD" || transactionData.PaymentEntity.Type === "DEBIT-CARD"){
             getData = await FeeConfigurationSpec.find({$or:  [{WildcardLen: maxLen}, {$and: [{EntityProperty: transactionData.PaymentEntity.Brand},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]}, 
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]}, 
                {$and: [{EntityProperty: transactionData.PaymentEntity.Brand},{FeeLocale: "*"}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: "*"}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: "*"},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Brand},{FeeLocale: localeType}, {FeeEntity: "*"}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: localeType}, {FeeEntity: "*"}]},
                {$and: [{EntityProperty: "*"},{FeeLocale: "*"}, {FeeEntity: "*"}]},
            ]})
         }
         else {
            getData = await FeeConfigurationSpec.find({$or: [{WildcardLen: maxLen}, {$and: [{EntityProperty: transactionData.PaymentEntity.Brand},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]}, 
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]}, 
                {$and: [{EntityProperty: transactionData.PaymentEntity.Issuer},{FeeLocale: "*"}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: "*"}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: "*"},{FeeLocale: localeType}, {FeeEntity: transactionData.PaymentEntity.Type}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Issuer},{FeeLocale: localeType}, {FeeEntity: "*"}]},
                {$and: [{EntityProperty: transactionData.PaymentEntity.Number},{FeeLocale: localeType}, {FeeEntity: "*"}]},
                {$and: [{EntityProperty: "*"},{FeeLocale: "*"}, {FeeEntity: "*"}]},
            ]})
         }
         
         console.log(getData, 'DATA')
         const getMin = getData.reduce((prev, curr) => {
                       console.log("min")
                        return prev.WildcardLen < curr.WildcardLen ? prev : curr;
                }, 0)
    console.log("getData", getData)
    console.log("getMIN", getMin)
 
    // CALCULATE APPLICABLE FEE
    if(getMin.FeeType === "FLAT_PERC"){
        console.log("FLAT_PERC");
        const percent = getMin.FeeValue[1].value
        const value = getMin.FeeValue[0].value
        console.log(percent, value);
        // 140 + ((1.4 / 100) * 1500)
        appliedFeeValue = ((value) + ((percent) / 100) * (transactionData.Amount));
        console.log('flat_perc', appliedFeeValue)
    }
    else if (getMin.FeeType === "FLAT"){
        const value = getMin.FeeValue[0].value
        appliedFeeValue = value;
        console.log('flat', appliedFeeValue)
    }
    else if (getMin.FeeType === "PERC"){
        const percent = getMin.FeeValue[0].value
        // ((fee value * transaction amount ) / 100)
        appliedFeeValue = ((percent * transactionData.Amount) / 100)
        console.log('perc', appliedFeeValue);
    }
    
    if(transactionData.Customer.BearsFee === true){
         ChargeAmount = transactionData.Amount + appliedFeeValue;
    }else{
         ChargeAmount = transactionData.Amount
    }

    const SettlementAmount = ChargeAmount - appliedFeeValue

    res.status(200).json({
        AppliedFeeID: getMin.FeeID,
        AppliedFeeValue: appliedFeeValue,
        ChargeAmount: ChargeAmount,
        SettlementAmount: SettlementAmount
    })
};

module.exports = computeTransaction;
 
