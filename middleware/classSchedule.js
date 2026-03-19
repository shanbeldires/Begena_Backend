const joi = require("joi")
const classScheduleVaidation = joi.object({
    type:joi.string().required().min(3),
    section:joi.string().required().min(3),
    date:joi.string().required().min(3),
    time:joi.string().required().min(3),

})
module.exports = classScheduleVaidation;