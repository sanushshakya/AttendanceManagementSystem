const { times } = require("lodash");
const _ = require("lodash");
const { Op } = require("sequelize");
const { AbsentRecord, sequelize } = require("../models");
const {
  NotFoundError,
  AlreadyExistsError,
} = require("../utils/exceptions.utils");
const attendanceService = require("./attendance.services");
const holidayService = require("./holiday.services");

class AbsentRecordService {
  async getById(id) {
    const absentRecordInDB = await AbsentRecord.findOne({
      raw: true,
      where: { id },
    });

    if (!absentRecordInDB) throw new NotFoundError("absent record not found");

    return absentRecordInDB;
  }

  /**
   *
   * @param {Object} options
   * @param {integer} options.limit
   * @param {integer} options.page
   * @param {string} options.from
   * @param {string} options.till
   * @param {integer} options.staff_id
   */
  async getAll(options) {
    const { limit, page, from, till, staff_id } = _.pick(options, [
      "limit",
      "page",
      "from",
      "till",
      "staff_id",
    ]);

    /**
     * filter options
     * from:
     * till:
     * attendeeId:
     */

    const queryOptions = [];

    if (staff_id) {
      queryOptions.push(
        sequelize.where(sequelize.col("staff_id"), "=", parseInt(staff_id))
      );
    }

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);

      queryOptions.push(sequelize.where(sequelize.col("date"), ">=", fromDate));
    }

    if (till) {
      const tillDate = new Date(till);
      tillDate.setHours(0, 0, 0, 0);

      queryOptions.push(sequelize.where(sequelize.col("date"), "<=", tillDate));
    }

    const newLimit = limit || 10;
    const newPage = page || 1;

    const absentRecordsInDB = await AbsentRecord.findAll({
      raw: true,
      order: [["created_at", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      where: {
        [Op.and]: queryOptions,
      },
    });
    return absentRecordsInDB;
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.date
   * @param {integer} data.staff_id
   */
  async create(data) {
    const date = new Date(data.date);
    date.setHours(0, 0, 0, 0);

    const absentRecordInDB = await AbsentRecord.findOne({
      where: { date: date, staff_id: data.staff_id },
    });

    // check if absent record set for the user in the given date
    if (absentRecordInDB)
      throw new AlreadyExistsError(
        "absent record is already created for the user on the given date"
      );

    return await AbsentRecord.create({
      date: date,
      staff_id: data.staff_id,
    });
  }

  async update(id, data) {
    const absentRecordInDB = await AbsentRecord.findOne({ where: { id } });

    if (!absentRecordInDB) throw new NotFoundError("absent record not found"); //Role not found

    return await AbsentRecord.update(data, { where: { id } });
  }

  async delete(id) {
    const absentRecordInDB = await AbsentRecord.findOne({ where: { id } });

    if (!absentRecordInDB) throw new NotFoundError("absent record not found"); //Role not found

    return await AbsentRecord.destroy({ where: { id } });
  }

  async createForAbsentUsers(date) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // check if today is holiday
    if (await holidayService.isHoliday(dateObj)) return;

    const absentUsers = await attendanceService.getAbsentUsers(dateObj);

    for (let user of absentUsers) {
      try {
        await this.create({ date: dateObj, staff_id: user.id });
      } catch (error) {
        if (error instanceof AlreadyExistsError) continue;
        throw error;
      }
    }
  }
}

module.exports = new AbsentRecordService();
