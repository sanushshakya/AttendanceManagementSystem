const _ = require("lodash");
const { Op } = require("sequelize");
const { Attendance, User, sequelize } = require("../models");
const { NotFoundError, UserSideError } = require("../utils/exceptions.utils");
const holidayService = require("./holiday.services");
const leaveRecordService = require("./leaveRecord.services");

class AttendanceService {
  /**
   *
   * get attendance by id
   *
   * @param {integer} id
   */
  async getById(id) {
    const attendanceInDB = await Attendance.findByPk(id, { raw: true });

    if (!attendanceInDB) throw new NotFoundError("attendance not found");

    return attendanceInDB;
  }

  /**
   *
   * get all attendances
   *
   * @param {Object} options
   * @param {integer} options.limit
   * @param {integer} options.page
   * @param {integer} options.from
   * @param {integer} options.till
   * @param {integer} options.staff_id
   */
  async getAll(options) {
    const { limit, page, from, till, staff_id } = _.pick(options, [
      "limit",
      "page",
      "date",
      "from",
      "till",
      "staff_id",
    ]);

    /**
     * filter options:
     *
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

    const attendancesInDB = await Attendance.findAll({
      raw: true,
      order: [["check_in", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      where: {
        [Op.and]: queryOptions,
      },
    });

    return attendancesInDB;
  }

  /**
   *
   * update attendance
   *
   * @param {integer} id
   * @param {Object} data
   * @param {integer} data.staff_id
   * @param {string} data.date
   * @param {float} data.total_time
   * @param {string} data.check_in
   * @param {string} data.check_out
   */

  async update(id, data) {
    const attendanceInDB = await Attendance.findByPk(id);

    if (!attendanceInDB) throw new NotFoundError("attendance not found");

    return await Attendance.update(data, { where: { id } });
  }

  /**
   *
   * remove attendance
   *
   * @param {integer} id
   * @param {boolean} soft - soft delete option
   */
  async delete(id, soft = false) {
    // delete attendance
    const attendanceInDB = await Attendance.findByPk(id);

    if (!attendanceInDB) throw new NotFoundError("attendance not found");

    await Attendance.destroy({ where: { id } });
  }

  /**
   *
   * staff check in for today
   *
   * @param {integer} staffId - staff id
   */
  async checkIn(staffId) {
    const checkInDate = new Date();

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const attendanceInDB = await Attendance.findOne({
      where: { staff_id: staffId, date: attendanceDate },
    });

    // check if user already checked in
    if (attendanceInDB) {
      throw new UserSideError("user already checked in for today");
    }

    // check if there is any holiday today
    if (await holidayService.isHoliday(checkInDate)) {
      throw new UserSideError("can't check in during holiday");
    }

    // check if user is currently in leave or not
    if (await leaveRecordService.isUserOnLeave(staffId, checkInDate)) {
      throw new UserSideError("can't check in during leave");
    }

    const todayDate = new Date(checkInDate);
    todayDate.setHours(0, 0, 0, 0);

    // create new attendance
    await Attendance.create({
      staff_id: staffId,
      date: todayDate,
      check_in: checkInDate,
      total_time: 1,
    });
  }

  /**
   *
   * staff check out for today
   *
   * @param {integer} staffId - attendee id who wants to check in
   */
  async checkOut(staffId) {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const attendanceInDB = await Attendance.findOne({
      where: {
        staff_id: staffId,
        date: todayDate,
      },
    });

    if (!attendanceInDB)
      throw new NotFoundError("user has not checked in for today");

    if (attendanceInDB.check_out)
      throw new NotFoundError("user has already checked out for today");

    const checkInDate = new Date(attendanceInDB.check_in);
    const checkOutDate = new Date();

    // calculate total time for attendance
    let totalTimeInSecond =
      (checkOutDate.getTime() - checkInDate.getTime()) / 1000;

    await Attendance.update(
      {
        check_out: checkOutDate,
        total_time: totalTimeInSecond,
      },
      {
        where: {
          staff_id: staffId,
          date: todayDate,
        },
      }
    );
  }

  /**
   *
   * get all users who are absent
   *
   * @param {string} date
   */
  async getAbsentUsers(date) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const presentStaffIdsInDB = await Attendance.findAll({
      raw: true,
      attributes: ["staff_id"],
      where: {
        date: dateObj,
      },
    });

    const presentStaffIds = presentStaffIdsInDB.map((psId) => psId.staff_id);

    const leavesForToday = await leaveRecordService.getAll({ date });

    const inLeaveStaffIds = leavesForToday.map((leave) => leave.staff_id);

    const absentUsersInDB = await User.findAll({
      raw: true,
      where: {
        id: { [Op.notIn]: [...presentStaffIds, ...inLeaveStaffIds] },
      },
    });

    return absentUsersInDB;
  }

  /**
   *
   * is user checked in for today
   *
   * @param {integer} staffId
   */
  async isUserCheckedInToday(staffId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceInDB = await Attendance.findOne({
      where: {
        staff_id: staffId,
        date: today,
      },
    });

    return !!attendanceInDB;
  }

  /**
   *
   * is user checked out for today
   *
   * @param {integer} staffId
   */
  async isUserCheckedOutToday(staffId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceInDB = await Attendance.findOne({
      where: {
        staff_id: staffId,
        date: today,
        check_out: {
          [Op.ne]: null,
        },
      },
    });

    return !!attendanceInDB;
  }

  async updateOrCreate(data) {
    let attendanceInDB = await Attendance.findOne({
      where: {
        staff_id: data.staff_id,
        date: data.date,
      },
    });

    const checkInDate = new Date(data.check_in);
    const checkOutDate = new Date(data.check_out);

    if (checkInDate.getTime() > checkOutDate.getTime())
      throw new UserSideError(
        "check in date can't be greater than check out date"
      );

    let totalTimeInSecond =
      (checkOutDate.getTime() - checkInDate.getTime()) / 1000;

    if (!attendanceInDB) {
      attendanceInDB = await Attendance.create({
        ...data,
        total_time: totalTimeInSecond,
      });
      return;
    }

    await Attendance.update(
      {
        ...data,
        totalTimeInSecond,
      },
      { where: { id: attendanceInDB } }
    );
  }
}

module.exports = new AttendanceService();
