const _ = require("lodash");
const { Setting } = require("../models");
const { UserSideError } = require("../utils/exceptions.utils");

class SettingServices {
  DEFAULT_WEEKENDS = [0, 6];

  // TODO: implement office start
  DEFAULT_OFFICE_START_TIME = 10;
  DEFAULT_OFFICE_END_TIME = 19;

  async get(options) {
    let settingInDB = await Setting.findOne({
      attributes: ["weekends"],
    });

    if (!settingInDB) {
      await this.create();
      settingInDB = await Setting.findOne();
    }

    return settingInDB;
  }

  async create() {
    const settingInDB = await Setting.findOne();

    if (settingInDB) return;

    const weekends = JSON.stringify(this.DEFAULT_WEEKENDS);

    await Setting.create({
      weekends,
    });
  }

  async getWeekends() {
    let settingInDB = await Setting.findOne();

    if (!settingInDB) {
      await this.create();
      settingInDB = await Setting.findOne();
    }

    return JSON.parse(settingInDB.weekends);
  }

  async changeWeekends(weekends) {
    if (!Array.isArray(weekends))
      throw new UserSideError("weekend needs to be an array");

    let settingInDB = await Setting.findOne();

    if (!settingInDB) {
      await this.create();
      settingInDB = await Setting.findOne();
    }

    const weekend = JSON.stringify(weekends);

    await Setting.update({ weekend }, { where: { id: settingInDB.id } });
  }

  async addWeekend(weekDay) {
    let settingInDB = await Setting.findOne();

    if (!settingInDB) {
      await this.create();
      settingInDB = await Setting.findOne();
    }

    const weekendsInDB = JSON.parse(settingInDB.weekends);

    await Setting.update(
      { weekends: JSON.stringify([...weekendsInDB, weekDay]) },
      { where: { id: settingInDB.id } }
    );
  }

  async removeWeekend(weekDay) {
    let settingInDB = await Setting.findOne();

    if (!settingInDB) {
      await this.create();
      settingInDB = await Setting.findOne();
    }

    const weekendsInDB = JSON.parse(settingInDB.weekends);

    await Setting.update(
      { weekends: JSON.stringify(weekendsInDB.filter((w) => w !== weekDay)) },
      { where: { id: settingInDB.id } }
    );
  }

  async destroy() {
    const settingInDB = await Setting.findOne();

    if (!settingInDB) return;
    await Setting.destroy({ where: { id: settingInDB.id } });
  }
}

module.exports = new SettingServices();
