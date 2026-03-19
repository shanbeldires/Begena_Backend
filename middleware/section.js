const joi = require("joi")
const sectionValidation = joi.object({
    section:joi.string().required().min(3),
    assignedTeacher:joi.string().required().min(3),
    classDate:joi.string().required().min(3),
    classTime:joi.string().required().min(3),

})
module.exports = sectionValidation;