const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validators");
const authValidator = require("../middlewares/validators/auth.validator");
const { checkAuth } = require("../middlewares/auth.middleware");

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: login a user
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: superuser@example.com
 *                          password:
 *                              type: string
 *                              example: superuser
 *     responses:
 *         '200':
 *             description: user logged in
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXBlcnVzZXJAZXhhbXBsZS5jb20iLCJyb2xlX25hbWUiOiJhZG1pbiIsImlhdCI6MTY0OTI1MTMwNiwiZXhwIjoxNjQ5MjU0OTA2fQ.AT6fEmh6XWlqndz2Y5KszW5Kula9DhRokYY7dNt8kFM
 *                              msg:
 *                                  type: string
 *                                  example: logged in
 *         '404':
 *             description: user does not exist
 *         '401':
 *             description: invalid credentials
 *         '500':
 *             description: internal server error
 * /auth/otp/email:
 *   post:
 *     tags: [Auth]
 *     summary: send otp to email
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *
 *     responses:
 *         '200':
 *             description: email sent
 *         '404':
 *             description: email not found
 *         '401':
 *             description: invalid credentials
 *         '500':
 *             description: internal server error
 *
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: user reset password
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          new_password:
 *                              type: string
 *                          re_entered_password:
 *                              type: string
 *                          token:
 *                              type: string
 *
 *     responses:
 *         '200':
 *             description: password reset successful
 *         '404':
 *             description: email not found
 *         '401':
 *             description: invalid credentials
 *         '500':
 *             description: internal server error
 *
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: user change password
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          old_password:
 *                              type: string
 *                          new_password:
 *                              type: string
 *                          re_entered_password:
 *                              type: string
 *
 *     responses:
 *         '200':
 *             description: password change successful
 *         '404':
 *             description: email not found
 *         '401':
 *             description: invalid credentials
 *         '500':
 *             description: internal server error
 *
 * /auth/otp/get-token:
 *   post:
 *     tags: [Auth]
 *     summary: user change password
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: number
 *
 *     responses:
 *         '200':
 *             description: token
 *         '404':
 *             description: otp is not valid
 *         '500':
 *             description: internal server error
 *
 */

router.post("/login", validate(authValidator.login()), authController.login);
router.post(
  "/change-password",
  checkAuth(),
  validate(authValidator.changePassword()),
  authController.changePassword
);
router.post(
  "/otp/email",
  validate(authValidator.sendOTP()),
  authController.sendOTPEmail
);
router.post(
  "/reset-password",
  validate(authValidator.resetPassword()),
  authController.resetPassword
);
router.post(
  "/otp/get-token",
  validate(authValidator.tokenFromOTP()),
  authController.tokenFromOTP
);

module.exports = { authRouter: router };
