const { body, validationResult } = require("express-validator");

const loginValidations = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .exists()
    .withMessage("Password is Required")
    .isLength({ min: 10 })
    .withMessage("Password must be greater than 10 characters"),
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
