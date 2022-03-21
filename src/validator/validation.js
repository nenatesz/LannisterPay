const { body, validationResult } = require('express-validator');

// USE EXPRESS VALIDATOR TO POST VALAIDATION RULES THAT VALIDATE THE DATA SENT BY THE FEE COMPUTATION SAMPLE PAYLOAD
const postValidationRule = () => [
    body('Amount').not().isEmpty().withMessage("The Amount should not be empty"),
    body('Currency').not().isEmpty().withMessage("The Currency should be a string"),
    body('CurrencyCountry').not().isEmpty().isString().withMessage("The Country Currency should be a string"),
    body('Customer.BearsFee').not().isEmpty().isBoolean().withMessage("The BearsFee should be a true or false"),
    body('PaymentEntity.Issuer').isString().withMessage("The Issuer should be a string"),
    body('PaymentEntity.Brand').isString().withMessage("The Brand should be a string"),
    body('PaymentEntity.Number').isString().withMessage("The Number should be a string"),
    body('PaymentEntity.Type').not().isEmpty().isString().withMessage("The Type should be a string"),
    body('PaymentEntity.Country').not().isEmpty().isString().withMessage("The Country should be a string"),    
    validate,
]

/**

 * An express middleware that collects and display `express-validator` generated errors for the `transaction API`.

 *  @param {object} req - Express request object.

 *  @param {object} res - Express response object.

 *  @param {function} next - The `next()` handler if validation is okay.

 */

 const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = errors.array().map(err => err)

    return res.status(400).json({
        errors: extractedErrors,
    })
}

module.exports = {postValidationRule};

