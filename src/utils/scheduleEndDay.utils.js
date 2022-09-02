const Queue = require("bull");
const logger = require("./logger.utils");
const vars = require("../configs/vars.configs");
const absentRecordServices = require("../services/absentRecord.services");

// TODO: add it in settings
const OFFICE_END_TIME_HOUR = 19;

const endDayQueue = new Queue("endDay", {
  redis: {
    host: vars.redis.host,
    port: vars.redis.port,
  },
});

const options = {
  repeat: { cron: `0 ${OFFICE_END_TIME_HOUR} * * *` },
};

exports.scheduleEndDay = (data) => {
  endDayQueue.add(data, options);
};

endDayQueue.process(async (job) => {
  logger.info("---------- Executing end day tasks!! ----------");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await absentRecordServices.createForAbsentUsers(today);
  return true;
});
