const Joi = require("joi");

const changePasswordValidator = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "New password and confirm password do not match.",
        }),
});

module.exports = changePasswordValidator;