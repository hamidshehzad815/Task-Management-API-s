const { body, validationResult } = require("express-validator");

const validations = [
  body("taskId").isInt().withMessage("Task ID must be an integer"),

  body("title")
    .optional()
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty after trimming"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty after trimming"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date (ISO 8601 format)"),

  body("priority")
    .optional()
    .toLowerCase()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of the following: Low, Medium, High"),

  body("status")
    .optional()
    .toLowerCase()
    .isIn(["pending", "completed"])
    .withMessage("Status must be one of the following: Pending, Completed"),

  body("assignedTo")
    .optional()
    .isInt()
    .withMessage("Assigned to must be an integer"),
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

module.exports = {
  validations,
  validate,
};
