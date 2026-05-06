const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("patient", "doctor").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  register: (req) => registerSchema.validate(req.body),
  login: (req) => loginSchema.validate(req.body),
  forgotPassword: (req) => forgotPasswordSchema.validate(req.body),
  resetPassword: (req) => resetPasswordSchema.validate(req.body),
};
