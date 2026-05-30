const Joi = require("joi");

const studentUserValidator = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .pattern(/^[a-zA-Z0-9._%+-]+@rajalakshmi\.edu\.in$/)
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.pattern.base": "Please use your college email (@rajalakshmi.edu.in)",
        }),

    password: Joi.string()
        .min(6)
        .max(128)
        .required(),

    role: Joi.string()
        .valid("admin", "student")
        .default("student"),

    rollNumber: Joi.string()
        .trim()
        .required(),

    department: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required(),

    parentPhone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Please enter a valid 10 digit phone number",
        }),

    roomNumber: Joi.string()
        .trim()
        .required(),

    hostelName: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required(),

    homeLocation: Joi.string()
        .min(2)
        .max(200)
        .trim()
        .required(),
});

module.exports = studentUserValidator;