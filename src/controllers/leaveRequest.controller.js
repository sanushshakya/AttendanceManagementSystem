const _ = require("lodash");
const leaveRequestService = require("../services/leaveRequest.services");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset, approval_status } = req.query;
    const data = await leaveRequestService.getAll({
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

    return res.json({ data: await leaveRequestService.getById(id) });
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
      "from",
      "till",
    ]);

    await leaveRequestService.create({ ...data, staff_id: user.id });
    res.json({ msg: "leave request created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.approveLeaveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await leaveRequestService.approveLeaveRequest(id);
    res.json({ msg: "leave request approved successfully" });
  } catch (error) {
    next(error);
  }
};

exports.declineLeaveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await leaveRequestService.declineLeaveRequest(id);
    res.json({ msg: "leave request declined successfully" });
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
