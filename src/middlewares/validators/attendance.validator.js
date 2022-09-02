const { check } = require("express-validator");

exports.updateAttendance = () => [
  check("staff_id")
    .optional()
    .not()
    .isEmpty()
    .withMessage("field is required")
    .isNumeric()
    .withMessage("field should be integer")
    .trim()
    .escape(),
  check("date")
    .optional()
    .not()
    .isEmpty()
    .withMessage("field is required")
    .isISO8601()
    .withMessage("field should be proper ISO format")
    .trim()
    .escape(),
  check("check_in")
    .optional()
    .not()
    .isEmpty()
    .withMessage("field is required")
    .isISO8601()
    .withMessage("field should be proper ISO format")
    .trim()
    .escape(),
  check("check_out")
    .optional()
    .not()
    .isEmpty()
    .withMessage("field is required")
    .isISO8601()
    .withMessage("field should be proper ISO format")
    .trim()
    .escape(),
  check("total_time")
    .optional()
    .not()
    .isEmpty()
    .withMessage("field is required")
    .isNumeric()
    .withMessage("field should be integer")
    .trim()
    .escape(),
];
