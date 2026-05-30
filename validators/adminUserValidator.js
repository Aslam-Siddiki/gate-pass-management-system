const Joi = require("joi");

const adminUserValidator = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(50)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    password: Joi.string()
        .min(8)
        .max(128)
        .required(),
        
    hostelName: Joi.string()
        .min(2)
        .max(100)
        .required(),

    role: Joi.string()
        .valid("admin", "student")
        .default("admin"),
});

module.exports = adminUserValidator;