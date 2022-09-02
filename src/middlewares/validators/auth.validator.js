const { check } = require("express-validator");

exports.login = () => [
  check("username").isEmail().trim().withMessage("email is required"),
  check("password").not().isEmpty().trim().withMessage("password is required"),
];

exports.sendOTP = () => [
  check("email")
    .trim()
    .isEmail()
    .withMessage("not a valid email")
    .not()
    .isEmpty()
    .withMessage("email is required"),
];

exports.changePassword = () => [
  check("old_password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
  check("new_password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
  check("re_enter_password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
];

exports.resetPassword = () => [
  check("token").isString().trim().withMessage("token is required"),
  check("new_password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
  check("re_enter_password")
    .not()
    .isStrongPassword()
    .trim()
    .withMessage("password is required"),
];

exports.tokenFromOTP = () => [
  check("code")
    .isNumeric()
    .withMessage("invalid otp code")
    .trim()
    .notEmpty()
    .withMessage("token is required"),
];
