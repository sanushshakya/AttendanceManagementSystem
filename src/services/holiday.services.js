const _ = require("lodash");
const { Holiday } = require("../models");
const {
  NotFoundError,
  AlreadyExistsError,
} = require("../utils/exceptions.utils");
const settingService = require("./setting.services");

class HolidayService {
  async getById(id) {
    const holidayInDB = await Holiday.findOne({ raw: true, where: { id } });

    if (!holidayInDB) throw new NotFoundError("holiday not found");

    return holidayInDB;
  }

  async getAll(options) {
    return await Holiday.findAll({
      raw: true,
      order: [["created_at", "DESC"]],
    });
  }

  async create(data) {
    const holidayInDB = await Holiday.findOne({ where: { date: data.date } });
    if (holidayInDB)
      throw new AlreadyExistsError("holiday already set for that day"); //role already existed

    const newDate = new Date(data.date);
    newDate.setHours(0, 0, 0, 0);
    data.date = newDate;

    return await Holiday.create(data);
  }

  async update(id, data) {
    const holidayInDB = await Holiday.findOne({ where: { id } });

    if (!holidayInDB) throw new NotFoundError("holiday not found"); //Role not found

    return await Holiday.update(data, { where: { id } });
  }

  async delete(id) {
    const holidayInDB = await Holiday.findOne({ where: { id } });

    if (!holidayInDB) throw new NotFoundError("holiday not found"); //Role not found

    return await Holiday.destroy({ where: { id } });
  }

  async isHoliday(date) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const weekDay = dateObj.getDay();

    const weekends = await settingService.getWeekends();

    let flag = false;
    weekends.forEach((weekend) => {
      if (weekDay === weekend) flag = true;
    });

    if (flag) return true;

    const holidayInDB = await Holiday.findOne({ where: { date: dateObj } });

    return !!holidayInDB;
  }
}

module.exports = new HolidayService();
