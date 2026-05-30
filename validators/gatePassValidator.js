const Joi = require("joi");

const gatepassValidator = Joi.object({
    reason: Joi.string()
        .min(3)
        .max(200)
        .default("Weekend Holiday")
        .trim(),

    exitDate: Joi.date()
        .required()
        .messages({
            "any.required": "Exit date is required.",
            "date.base": "Please enter a valid exit date.",
        }),

    returnDate: Joi.date()
        .greater(Joi.ref("exitDate"))
        .required()
        .messages({
            "date.greater": "Return date must be after exit date.",
            "any.required": "Return date is required.",
        }),

    status: Joi.string()
        .valid("Pending", "Approved", "Rejected")
        .default("Pending"),
});

module.exports = gatepassValidator;