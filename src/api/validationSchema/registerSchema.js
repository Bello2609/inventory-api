const Joi = require("joi");

const registerSchema = Joi.object({
    fullname: Joi.string()
        .required(),
    password: Joi.string(),
    confirmPassword: Joi.ref("password"),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } }),
    role: Joi.string()
})
module.exports = registerSchema;