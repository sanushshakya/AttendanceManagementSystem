const { Op } = require("sequelize");
const _ = require("lodash");
const { User, Role, OTP } = require("../models");
const {
  hashPasswordAsync,
  comparePasswordAsync,
} = require("../utils/bcrypt.utils");
const {
  NotFoundError,
  InvalidCredentials,
  UserSideError,
} = require("../utils/exceptions.utils");
const { generateTokenAsync, validateToken } = require("../utils/jwt.utils");
const { scheduleSendMail } = require("../utils/scheduleMail.utils");
const { generateOTP } = require("../utils/generateOTP.utils");

class AuthService {
  async loginUser(data) {
    const userInDB = await User.findOne({
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"],
        },
      ],
      where: {
        [Op.or]: [{ email: data.username }, { id: data.username }],
      },
    });

    if (!userInDB)
      throw new InvalidCredentials("username or password is incorrect");

    if (!(await comparePasswordAsync(data.password, userInDB.password)))
      throw new InvalidCredentials("username or password is incorrect"); //User entered wrong credentials

    await User.update(
      {
        last_login: userInDB.current_login,
        current_login: new Date(),
      },
      { where: { id: userInDB.id } }
    );

    const payload = {
      id: userInDB.id,
      first_name: userInDB.first_name,
      last_name: userInDB.last_name,
      last_login: userInDB.last_login,
      email: userInDB.email,
      role_name: userInDB.role.role_name,
    };

    return await generateTokenAsync(payload);
  }

  async sendOtpEmail(data) {
    const userInDB = await User.findOne({ where: { email: data.email } });

    if (!userInDB) throw new NotFoundError("user not found");

    const otpInDB = await this.createOTP(userInDB.email);

    scheduleSendMail({
      to: data.email,
      subject: "forgot password",
      html: `
      <p>Someone (hopefully you) has requested a password reset for your Hajiri account.</p>
      <br/>
      <p>OTP code</p>
      <p style="font-size: 24px;"><strong>${otpInDB.code}</strong></p>
      <p style="opacity: 70%";>(This code is valid for 10 minutes)</p>
      <br/>
      <p>If you don't wish to reset your password, disregard this email and no action will be taken.</p>
      <br/>
      <br/>
      Sincerely,
      <br/>
      The Hajiri Team
      `,
    });
  }

  async getTokenFromOTP(code) {
    if (!(await this.isOTPValid(code)))
      throw new UserSideError("opt is not valid");

    const otpInDB = await OTP.findOne({
      where: {
        code: code,
        valid: true,
      },
    });

    const payload = {
      email: otpInDB.email,
    };

    await OTP.update({ valid: false }, { where: { id: otpInDB.id } });

    return await generateTokenAsync(payload);
  }

  async changePassword(data, key) {
    const token = key.split(" ")[1];

    const decoded = await validateToken(token);
    if (decoded.error) throw new InvalidCredentials({ error: decoded.error });

    const userInDB = await User.findOne({
      where: {
        email: decoded.data.email,
      },
    });

    if (!userInDB) throw new NotFoundError("user not found"); //User not found

    if (!(await comparePasswordAsync(data.old_password, userInDB.password)))
      throw new InvalidCredentials("old password is incorrect");

    if (data.new_password != data.re_entered_password)
      throw new UserSideError(
        "new password and re entered password doesn't match"
      ); //User entered wrong credentials

    const resetPassword = await hashPasswordAsync(data.new_password);

    await User.update(
      { password: resetPassword },
      { where: { email: decoded.data.email } }
    );
  }

  async resetPassword(data) {
    const decoded = await validateToken(data.token);

    if (decoded.error) throw new InvalidCredentials({ error: decoded.error });

    const userInDB = await User.findOne({
      where: {
        email: decoded.data.email,
      },
    });

    if (!userInDB) throw new NotFoundError("user not found"); //User not found

    if (!data.new_password === data.re_entered_password)
      throw new InvalidCredentials(
        "new password and re entered password doesn't match"
      );

    if (await comparePasswordAsync(data.new_password, userInDB.password))
      throw new UserSideError("cannot use same password."); //User entered wrong credentials

    const password = await hashPasswordAsync(data.new_password);

    await User.update({ password }, { where: { email: decoded.data.email } });
  }

  async createOTP(email) {
    const expiryDate = new Date(new Date().getTime() + 10 * 60000);

    const otpInDB = await OTP.create({
      code: generateOTP(),
      email,
      expiry_date: expiryDate,
    });

    return otpInDB;
  }

  async isOTPValid(code) {
    const otpInDB = await OTP.findOne({
      where: {
        code,
        valid: true,
      },
    });

    if (!otpInDB) return false;

    const expiryDate = new Date(otpInDB.expiry_date);

    if (expiryDate.getTime() < new Date().getTime()) {
      await OTP.update({ valid: false }, { where: { id: otpInDB.id } });
      return false;
    }

    return true;
  }
}

module.exports = new AuthService();
