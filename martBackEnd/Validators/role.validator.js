const Joi = require("joi");

const roleSchema = Joi.object({
    role: Joi.string().required().min(3),
    role_active: Joi.boolean().optional().allow(null),
});

module.exports = roleSchema;