const Joi = require("@hapi/joi");

const registerValidation = (user) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3),
    name: Joi.string().required().min(3),
    surname: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });
  const validation = schema.validate(user);
  return validation;
};

/*
 * loginValidation
 */
const loginValidation = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required().min(6),
  });
  const validation = schema.validate(user);
  return validation;
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
