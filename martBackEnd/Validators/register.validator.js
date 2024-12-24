const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(3).required().min(3).max(25),
    username: Joi.string().allow("", null),
    phone: Joi.string().required().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number, starts with: 6, 7, 8, 9, min digit: 10, max digit: 10"),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
    organization: Joi.string().min(6).optional(),
    site: Joi.string().min(6).optional(),
    department: Joi.string().min(6).optional(),
    role: Joi.array().items(Joi.string()).required(),
    image: Joi.string().allow("", null).optional(),
    isUserBlocked: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
});

module.exports = registerSchema;
