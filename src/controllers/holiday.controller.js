const _ = require("lodash");
const holidayService = require("../services/holiday.services");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const data = await holidayService.getAll({
      limit: +limit,
      offset: +offset,
    });
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    return res.json({ data: await holidayService.getById(id) });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = _.pick(req.body, ["reason", "date"]);
    await holidayService.create(data);
    return res.json({ msg: "holiday created successfully" });
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
