const { check } = require("express-validator");

exports.create = () => [
  check("first_name").isString().trim().withMessage("first name is required"),
  check("last_name").isString().trim().withMessage("last name is required"),
  check("email").isEmail().trim().withMessage("email is required"),
  check("password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
  check("role_id").not().isEmpty().trim().withMessage("role id is required"),
  check("supervisor_id")
    .not()
    .isEmpty()
    .trim()
    .withMessage("supervisor id is required"),
  check("designation")
    .not()
    .isEmpty()
    .withMessage("designation is required")
    .isString()
    .withMessage("designation should be a string")
    .trim(),
];

exports.update = () => [
  check("first_name")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("first name is required"),
  check("last_name")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("last name is required"),
  check("email").optional().notEmpty().trim().withMessage("Email is required"),
  check("password")
    .optional()
    .notEmpty()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
  check("role_id")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("role id is required"),
  check("supervisor_id")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("supervisor id is required"),
  check("designation")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("designation is required"),
];
