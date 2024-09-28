const { body, validationResult } = require("express-validator");

const requestValidations = [
  body("taskId").optional().isInt().withMessage("Must be a int"),
  body("title")
    .exists()
    .withMessage("title is required")
    .isString()
    .withMessage("Must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("dueDate").optional().isDate().withMessage("Must be a date"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be one of the following: Low, Medium, High"),
  body("status")
    .optional()
    .isIn(["Pending", "Completed"])
    .withMessage("status must be one of the following: Pending, Completed"),
  body("assignedTo").optional().isInt().withMessage("Must be a int"),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

module.exports = {
  requestValidations,
  validateRequest,
};
