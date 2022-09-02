const _ = require("lodash");
const attendanceRequestService = require("../services/attendanceRequest.services");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset, approval_status } = req.query;
    const data = await attendanceRequestService.getAll({
      limit: +limit,
      offset: +offset,
      approval_status,
    });
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    return res.json({ data: await attendanceRequestService.getById(id) });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = req.user;

    const data = _.pick(req.body, [
      "reason_title",
      "reason_desc",
      "check_in",
      "check_out",
      "date",
    ]);

    await attendanceRequestService.create({ ...data, staff_id: user.id });
    res.json({ msg: "attendance request created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.approveAttendanceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await attendanceRequestService.approveAttendanceRequest(id);
    res.json({ msg: "attendance request approved successfully" });
  } catch (error) {
    next(error);
  }
};

exports.declineAttendanceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await attendanceRequestService.declineAttendanceRequest(id);
    res.json({ msg: "attendance request declined successfully" });
  } catch (error) {
    next(error);
  }
};

// exports.update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     res.json({ msg: "role updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.delete = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     res.json({ msg: "role delete successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
