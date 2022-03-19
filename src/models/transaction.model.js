const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    Amount: {type: Number, required: true},
    Currency: {type: String, required: true},
    CurrencyCountry: {type: String, required: true},
    Customer: new mongoose.Schema({ EmailAddress: String, FullName: Number, BearersFees: Boolean}),
    PaymentEntiti: new mongoose.Schema({ Issuer: String, Brand: String, Number: Number, SixID: Number, Type: String, Country: String })
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;