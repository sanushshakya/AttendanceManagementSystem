const nodemailer = require("nodemailer");
const config = require("../configs/nodemailer.config");
const vars = require("../configs/vars.configs");

/**
 *
 * @param {Object} data
 * @param {string} data.to
 * @param {string} data.subject
 * @param {string} data.html
 * @returns
 */
const sendMail = async (data) =>
  new Promise(async (resolve, reject) => {
    // Create a SMTP transporter object
    const transporter = await nodemailer.createTransport(config);

    const mailData = {
      from: vars.mail_email, // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      html: data.html, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        reject(err);
      } else resolve(info);
    });
  });

module.exports = { sendMail };
