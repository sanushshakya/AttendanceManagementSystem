const cron = require("node-cron");
const logger = require("./logger.utils");

exports.scheduleTaskEveryDay = async (hour, func) => {
  // `0 ${hour} * * *`,
  const ct = cron.schedule(
    `0 ${hour} * * *`,
    () => {
      logger.info("cron job started");
      func();
    },
    {
      scheduled: true,
      // TODO: only works for ktm
      timezone: "Asia/Kathmandu",
    }
  );
  ct.start();
};
