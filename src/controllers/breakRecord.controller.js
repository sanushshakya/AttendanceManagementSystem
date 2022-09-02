const _ = require("lodash");
const breakRecordService = require("../services/breakRecord.services");

exports.getAll = async (req, res, next) => {
  try {
    const { staff_id, date } = req.query;

    const data = await breakRecordService.getAll({ staff_id, date });

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await breakRecordService.getById(id);

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.breakStart = async (req, res, next) => {
  try {
    const user = req.user;

    await breakRecordService.startBreak(user.id);

    return res.json({ msg: "break has been started" });
  } catch (error) {
    next(error);
  }
};

exports.breakEnd = async (req, res, next) => {
  try {
    const user = req.user;

    await breakRecordService.endBreak(user.id);

    return res.json({ msg: "break has been ended" });
  } catch (error) {
    next(error);
  }
};

// exports.create = async (req, res, next) => {
//   try {
//     const role = _.pick(req.body, [""]);
//     await breakRecordService.create(role);
//     res.json({ msg: "leave record created successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const role = _.pick(req.body, ["role_name"]);
//     await breakRecordService.update(id, role);
//     res.json({ msg: "leave record updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.delete = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await breakRecordService.destroy(id);
//     res.json({ msg: "role delete successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
