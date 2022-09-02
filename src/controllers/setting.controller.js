const _ = require("lodash");
const settingService = require("../services/setting.services");

exports.get = async (req, res, next) => {
  try {
    const setting = await settingService.get();

    return res.json({ data: setting });
  } catch (error) {
    next(error);
  }
};

exports.addWeekend = async (req, res, next) => {
  try {
    const setting = _.pick(req.body, ["week_day"]);
    await settingService.addWeekend(setting.week_day);
    return res.json({ msg: "week day updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.removeWeekend = async (req, res, next) => {
  try {
    const setting = _.pick(req.body, ["week_day"]);
    await settingService.removeWeekend(setting.week_day);
    return res.json({ msg: "week day updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.reset = async (req, res, next) => {
  try {
    await settingService.destroy();
    return res.json({ msg: "setting delete successfully" });
  } catch (error) {
    next(error);
  }
};
