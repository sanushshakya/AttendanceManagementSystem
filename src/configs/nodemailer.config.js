const vars = require("./vars.configs");

module.exports = {
  host: vars.nodemailer.host,
  port: vars.nodemailer.port,
  auth: {
    user: vars.nodemailer.auth.user,
    pass: vars.nodemailer.auth.pass,
  },
};
