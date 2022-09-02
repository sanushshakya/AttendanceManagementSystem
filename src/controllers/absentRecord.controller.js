const _ = require("lodash");
const absentRecordService = require("../services/absentRecord.services");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, page, staff_id, from, till } = req.query;
    const role = await absentRecordService.getAll({
      limit: +limit,
      page: +page,
      staff_id,
      from,
      till,
    });
    return res.json({ data: role });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await absentRecordService.getById(id);

    return res.json({ data: role });
  } catch (error) {
    next(error);
  }
};

// exports.create = async (req, res, next) => {
//   try {
//     const role = _.pick(req.body, [""]);
//     await absentRecordService.create(role);
//     res.json({ msg: "leave record created successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const role = _.pick(req.body, ["role_name"]);
//     await absentRecordService.update(id, role);
//     res.json({ msg: "leave record updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.delete = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await absentRecordService.destroy(id);
//     res.json({ msg: "role delete successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
