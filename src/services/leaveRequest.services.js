const _ = require("lodash");
const { Op } = require("sequelize");
const { LeaveRequest, User, sequelize } = require("../models");
const { NotFoundError, UserSideError } = require("../utils/exceptions.utils");

const leaveRecordService = require("./leaveRecord.services");

class LeaveRequestService {
  /**
   *
   * create leave request
   *
   * @param {Object} data
   * @param {Object} data.reason_title
   * @param {Object} data.reason_desc
   * @param {Object} data.from
   * @param {Object} data.till
   * @param {Object} data.staff_id
   */
  async create(data) {
    // check if staff_id
    const staffInDB = await User.findOne({ where: { id: data.staff_id } });
    if (!staffInDB) throw new NotFoundError("staff not found");

    // set from_date to_date hours to 0
    const fromDate = new Date(data.from);
    const tillDate = new Date(data.till);
    fromDate.setHours(0, 0, 0, 0);
    tillDate.setHours(0, 0, 0, 0);

    await LeaveRequest.create({
      ...data,
      from: fromDate,
      till: tillDate,
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

    const leaveRequestsInDB = await LeaveRequest.findAll({
      order: [["created_at", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      where: {
        [Op.and]: queryOptions,
      },
    });

    return leaveRequestsInDB;
  }

  async getById(id) {
    const leaveInDB = LeaveRequest.findOne({ where: { id } });

    if (!leaveInDB) throw new UserSideError("leave request not found");

    return leaveInDB;
  }

  async approveLeaveRequest(id) {
    const leaveRequestInDB = await LeaveRequest.findOne({
      where: { id },
    });

    if (!leaveRequestInDB) throw new NotFoundError("leave request not found");

    await LeaveRequest.update({
      approval_status: true,
      approval_date: new Date(),
    });

    await leaveRecordService.create({
      till: leaveRequestInDB.till,
      from: leaveRequestInDB.from,
      staff_id: leaveRequestInDB.staff_id,
    });
  }

  async declineLeaveRequest(id) {
    const leaveRequestInDB = await LeaveRequest.findOne({
      where: { id },
    });

    if (!leaveRequestInDB) throw new NotFoundError("leave request not found");

    await LeaveRequest.update({
      approval_status: false,
    });
  }
}

module.exports = new LeaveRequestService();
