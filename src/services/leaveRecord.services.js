const _ = require("lodash");
const { Op } = require("sequelize");
const { LeaveRecord, sequelize } = require("../models");
const {
  NotFoundError,
  AlreadyExistsError,
} = require("../utils/exceptions.utils");

class LeaveRecordService {
  async getById(id) {
    const leaveRecordInDB = await LeaveRecord.findOne({
      raw: true,
      where: { id },
    });

    if (!leaveRecordInDB) throw new NotFoundError("leave record not found");

    return leaveRecordInDB;
  }

  async getAll(options) {
    const { limit, page, from, till, date, staff_id } = _.pick(options, [
      "from",
      "till",
      "date",
      "limit",
      "page",
      "staff_id",
    ]);

    const queryOptions = [];

    if (staff_id) {
      queryOptions.push(
        sequelize.where(sequelize.col("staff_id"), "=", parseInt(staff_id))
      );
    }

    if (date) {
      const givenDate = new Date(date);

      queryOptions.push(
        sequelize.or(
          sequelize.where(sequelize.col("from"), "<=", givenDate),
          sequelize.where(sequelize.col("till"), ">=", givenDate)
        )
      );
    }

    if (from) {
      const fromDate = new Date(from);

      queryOptions.push(
        sequelize.or(
          sequelize.where(sequelize.col("from"), ">=", fromDate),
          sequelize.where(sequelize.col("till"), ">=", fromDate)
        )
      );
    }

    if (till) {
      const tillDate = new Date(till);

      queryOptions.push(
        sequelize.or(
          sequelize.where(sequelize.col("from"), "<=", tillDate),
          sequelize.where(sequelize.col("till"), "<=", tillDate)
        )
      );
    }

    const newLimit = limit || 10;
    const newPage = page || 1;

    return await LeaveRecord.findAll({
      raw: true,
      order: [["created_at", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      where: {
        where: {
          [Op.and]: queryOptions,
        },
      },
    });
  }

  async create(data) {
    // check if leave record set for the user in the given range
    const leaveInDB = this.getAll({ from: data.from, till: data.till });

    if (leaveInDB.length > 0)
      throw new AlreadyExistsError("leave already exist in the given range");

    // take only date out of till and from
    const tillDate = new Date(data.till);
    tillDate.setHours(0, 0, 0, 0);

    const fromDate = new Date(data.from);
    fromDate.setHours(0, 0, 0, 0);

    return await LeaveRecord.create({
      till: tillDate,
      from: fromDate,
      staff_id: data.staff_id,
    });
  }

  async update(id, data) {
    const leaveRecordInDB = await LeaveRecord.findOne({ where: { id } });

    if (!leaveRecordInDB) throw new NotFoundError("leave record not found"); //Role not found

    return await LeaveRecord.update(data, { where: { id } });
  }

  async delete(id) {
    const leaveRecordInDB = await LeaveRecord.findOne({ where: { id } });

    if (!leaveRecordInDB) throw new NotFoundError("leave record not found"); //Role not found

    return await LeaveRecord.destroy({ where: { id } });
  }

  async isUserOnLeave(staffId, date) {
    const givenDate = new Date(date);
    givenDate.setHours(0, 0, 0, 0);

    const leaveRecordInDB = await LeaveRecord.findOne({
      where: {
        [Op.and]: {
          staff_id: staffId,
          [Op.and]: {
            from: { [Op.lt]: givenDate },
            till: { [Op.gt]: givenDate },
          },
        },
      },
    });

    return !!leaveRecordInDB;
  }
}

module.exports = new LeaveRecordService();
