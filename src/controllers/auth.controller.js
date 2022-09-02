const _ = require("lodash");
const authService = require("../services/auth.services");

exports.login = async (req, res, next) => {
  try {
    const reqObj = _.pick(req.body, ["username", "password"]);
    const user = await authService.loginUser(reqObj);
    return res.json({ token: user, msg: "logged in." });
  } catch (error) {
    next(error);
  }
};

exports.sendOTPEmail = async (req, res, next) => {
  try {
    const reqObj = _.pick(req.body, ["email"]);
    console.log(reqObj);

    const user = await authService.sendOtpEmail(reqObj);

    return res.json({ token: user, msg: "please checked your email." });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const reqObj = _.pick(req.body, [
      "old_password",
      "new_password",
      "re_entered_password",
    ]);

    console.log(reqObj);

    await authService.changePassword(reqObj, token);

    return res.json({ msg: "password successfully changed" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const reqObj = _.pick(req.body, [
      "new_password",
      "re_entered_password",
      "token",
    ]);
    await authService.resetPassword(reqObj);
    return res.json({
      msg: "password reset successful.",
    });
  } catch (error) {
    next(error);
  }
};

exports.tokenFromOTP = async (req, res, next) => {
  try {
    const reqObj = _.pick(req.body, ["code"]);
    const token = await authService.getTokenFromOTP(reqObj.code);
    return res.json({
      msg: "password reset successful.",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
