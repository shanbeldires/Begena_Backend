const joi = require("joi")
const announcementValidation = joi.object({
    title:joi.string().required().min(3),
    body:joi.string().required().min(3),
    date:joi.string().required().min(3),
    time:joi.string().required().min(3),
})
module.exports = announcementValidation;