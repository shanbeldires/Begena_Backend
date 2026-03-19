const joi = require("joi")
const paymentValidation = joi.object({
    fullName:joi.string().required().min(3),
    section:joi.string().required().min(3),
    screenshot:joi.string().uri().required().min(3),
    month:joi.string().required().min(3),
    begenaId:joi.string().required().min(3),
    batch:joi.string().required().min(3),   
})
module.exports = paymentValidation;