const mongoose = require("mongoose");

const feeConfigurationSpecSchema = new mongoose.Schema({
    FeeID: {type: String, required: true},
    FeeCurrency: {type: String, required: true},
    FeeLocale: {type: String, required: true},
    FeeEntity: {type: String, required: true},
    EntityProperty: {type: String, required: true},
    FeeType: {type: String, required: true},
    WildcardLen: {type: Number, required: true},
    FeeValue: [ { isPercent: Boolean, value: Number }],
}, {timestamps: true});

const FeeConfigurationSpec = mongoose.model("FeeConfigurationSpec", feeConfigurationSpecSchema);

module.exports = FeeConfigurationSpec;