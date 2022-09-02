const Queue = require("bull");
const vars = require("../configs/vars.configs");
const { sendMail } = require("./nodemailer.utils");

const sendMailQueue = new Queue("sendMail", {
  redis: {
    host: vars.redis.host,
    port: vars.redis.port,
  },
});

const options = {};

exports.scheduleSendMail = (data) => {
  sendMailQueue.add(data, options);
};

sendMailQueue.process(async (job) => {
  return await sendMail(job.data);
});
