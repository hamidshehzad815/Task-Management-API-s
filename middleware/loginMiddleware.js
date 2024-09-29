const { body, validationResult } = require("express-validator");

const loginValidations = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty after trimming"),
];

function validateLogin(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

module.exports = {
  loginValidations,
  validateLogin,
};
