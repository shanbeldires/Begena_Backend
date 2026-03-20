const joi = require("joi")
const userValidation= joi.object({
    full_name:joi.string().required().min(3),
    email:joi.string().required().email(),
    password:joi.string().required().min(8),
    phone:joi.string().required().min(10),
    address:joi.string().required().min(4),
    role:joi.string().valid("user", "admin").optional()
})
module.exports = userValidation;