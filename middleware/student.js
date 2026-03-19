const joi = require("joi")
const studentValidation = joi.object({
    fullName:joi.string().required().min(3),
    begenaId:joi.string().required().min(3),
    batch:joi.string().required().min(3),
    section:joi.string().required().min(3),
    department:joi.string().required().min(3),
    phoneNumber:joi.string().required().min(10),
})
module.exports = studentValidation;