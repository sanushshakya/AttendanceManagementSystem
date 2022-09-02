const _ = require("lodash");
const { Op } = require("sequelize");
const { BreakRecord, sequelize } = require("../models");
const { NotFoundError, UserSideError } = require("../utils/exceptions.utils");
const attendanceService = require("./attendance.services");

class BreakRecordService {
  async getById(id) {
    const breakRecordInDB = await BreakRecord.findOne({
      raw: true,
      where: { id },
    });

    if (!breakRecordInDB) throw new NotFoundError("break record not found");

    return breakRecordInDB;
  }

  async getAll(options) {
    const { date, staff_id } = _.pick(options, "date", "staff_id");

    const givenDate = new Date(date);
    givenDate.setHours(0, 0, 0, 0);

    const queryOptions = [];

    if (date) {
      queryOptions.push(sequelize.where(sequelize.col("date"), "=", givenDate));
    }

    if (staff_id) {
      queryOptions.push(
        sequelize.where(sequelize.col("staff_id"), "=", parseInt(staff_id))
      );
    }

    return await BreakRecord.findAll({
      raw: true,
      order: [["created_at", "DESC"]],
      where: {
        [Op.and]: queryOptions,
      },
    });
  }

  async create(data) {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await BreakRecord.create({
      start: startDate,
      end: endDate,
      date,
      staff_id: data.staff_id,
    });
  }

  async update(id, data) {
    const breakRecordInDB = await BreakRecord.findOne({ where: { id } });

    if (!breakRecordInDB) throw new NotFoundError("break record not found"); //Role not found

    return await BreakRecord.update(data, { where: { id } });
  }

  async delete(id) {
    const breakRecordInDB = await BreakRecord.findOne({ where: { id } });

    if (!breakRecordInDB) throw new NotFoundError("break record not found"); //Role not found

    return await BreakRecord.destroy({ where: { id } });
  }

  async startBreak(staffId) {
    const startDate = new Date();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (!(await attendanceService.isUserCheckedInToday(staffId))) {
      throw new UserSideError(
        "can't start a break if user has not checked in yet"
      );
    }

    if (await attendanceService.isUserCheckedOutToday(staffId)) {
      throw new UserSideError(
        "can't start a break if user is already checked out today"
      );
    }

    const breakInDB = await BreakRecord.findOne({
      where: {
        date: currentDate,
        end: null,
      },
    });

    if (breakInDB) throw new UserSideError("break has already started");

    await BreakRecord.create({
      start: startDate,
      date: currentDate,
      staff_id: staffId,
    });
  }

  async endBreak(staffId) {
    const endDate = new Date();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const breakInDB = await BreakRecord.findOne({
      where: {
        staff_id: staffId,
        date: currentDate,
        end: null,
      },
    });

    if (!breakInDB)
      throw new UserSideError("can't end break which has not yet started");

    await BreakRecord.update({ end: endDate }, { where: { id: breakInDB.id } });
  }
}

module.exports = new BreakRecordService();
