const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  secret: process.env.SECRET,
  api_base_url: `${process.env.API_BASE_URL}/api`,
  static_base_url: `${process.env.API_BASE_URL}/static`,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
  },
  nodemailer: {
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  },
  superuser: {
    email: process.env.SUPERUSER_EMAIL,
    pass: process.env.SUPERUSER_PASS,
  },
  mail_email: process.env.MAIL_EMAIL,
};
