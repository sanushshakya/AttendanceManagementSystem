const { check } = require("express-validator");

exports.roleCreate = () => [
  check("role_name").isString().trim().withMessage("role name is required"),
];

exports.roleUpdate = () => [
  check("role_name")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("role name is required"),
];
