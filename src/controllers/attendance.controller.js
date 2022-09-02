const _ = require("lodash");

const attendanceService = require("../services/attendance.services");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, page, staff_id, from, till } = req.query;
    const data = await attendanceService.getAll({
      limit: +limit,
      page: +page,
      staff_id,
      from,
      till,
    });

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    return res.json({ data: await attendanceService.getById(id) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = _.pick(req.body, [
      "staff_id",
      "date",
      "total_time",
      "check_in",
      "check_out",
    ]);

    await attendanceService.update(id, data);

    return res.json({ msg: "attendance successfully updated" });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await attendanceService.delete(id);

    return res.json({ msg: "attendance successfully deleted" });
  } catch (error) {
    next(error);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const user = req.user;

    await attendanceService.checkIn(user.id);

    res.json({ msg: "user checked in successfully" });
  } catch (error) {
    next(error);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const user = req.user;

    await attendanceService.checkOut(user.id);

    res.json({ msg: "user checked out successfully" });
  } catch (error) {
    next(error);
  }
};
