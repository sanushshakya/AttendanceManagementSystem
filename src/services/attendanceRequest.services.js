const _ = require("lodash");
const { Op } = require("sequelize");
const { AttendanceRequest, User, sequelize, Attendance } = require("../models");
const { NotFoundError, UserSideError } = require("../utils/exceptions.utils");

const attendanceService = require("./attendance.services");

class AttendanceRequestService {
  /**
   *
   * create attendance request
   *
   * @param {Object} data
   * @param {Object} data.reason_title
   * @param {Object} data.reason_desc
   * @param {Object} data.date
   * @param {Object} data.check_in
   * @param {Object} data.check_out
   * @param {Object} data.staff_id
   */
  async create(data) {
    // check if staff_id
    const staffInDB = await User.findOne({ where: { id: data.staff_id } });
    if (!staffInDB) throw new NotFoundError("staff not found");

    data.check_in = new Date(data.check_in);
    data.check_in = new Date(data.check_out);
    data.date = new Date(data.date);

    if (!data.check_in || !data.check_out || !data.date)
      throw new UserSideError("check in and check out must be valid");

    // TODO: comparing strings
    if (
      data.check_in.toDateString() !== data.date.toDateString() ||
      data.check_in.toDateString() !== data.date.toDateString()
    )
      throw new UserSideError("check in and check out must be valid");

    await AttendanceRequest.create({
      ...data,
    });
  }

  async getAll(options) {
    const APPROVAL_STATUS = {
      pending: null,
      approved: true,
      rejected: false,
    };

    const { limit, page, approval_status } = _.pick(options, [
      "limit",
      "page",
      "approval_status",
    ]);

    const queryOptions = [];

    if (approval_status) {
      queryOptions.push(
        sequelize.where(
          sequelize.col("approval_status"),
          "=",
          APPROVAL_STATUS[approval_status]
        )
      );
    }

    const newLimit = limit || 10;
    const newPage = page || 1;

    const attendanceRequestsInDB = await AttendanceRequest.findAll({
      order: [["created_at", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      where: {
        [Op.and]: queryOptions,
      },
    });

    return attendanceRequestsInDB;
  }

  async getById(id) {
    const attendanceRequestInDB = AttendanceRequest.findOne({ where: { id } });

    if (!attendanceRequestInDB)
      throw new UserSideError("attendance request not found");

    return attendanceRequestInDB;
  }

  async approveAttendanceRequest(id) {
    const attendanceRequestInDB = await AttendanceRequest.findOne({
      where: { id },
    });

    if (!attendanceRequestInDB)
      throw new NotFoundError("attendance request not found");

    await attendanceService.updateOrCreate({
      check_in: attendanceRequestInDB.check_in,
      check_out: attendanceRequestInDB.check_out,
      date: attendanceRequestInDB.date,
      staff_id: attendanceRequestInDB.staff_id,
    });

    await AttendanceRequest.update({
      approval_status: true,
      approval_date: new Date(),
    });
  }

  async declineAttendanceRequest(id) {
    const attendanceRequestInDB = await AttendanceRequest.findOne({
      where: { id },
    });

    if (!attendanceRequestInDB)
      throw new NotFoundError("attendance request not found");

    await AttendanceRequest.update({
      approval_status: false,
    });
  }
}

module.exports = new AttendanceRequestService();
