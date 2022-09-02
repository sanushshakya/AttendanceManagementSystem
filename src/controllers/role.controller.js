const _ = require("lodash");
const roleService = require("../services/role.services");

exports.getAll = async (req, res, next) => {
  try {
    const role = await roleService.getAll();
    return res.json({ data: role });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await roleService.getById(id);

    return res.json({ data: role });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const role = _.pick(req.body, ["role_name"]);
    await roleService.create(role);
    res.json({ msg: "role created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = _.pick(req.body, ["role_name"]);
    await roleService.update(id, role);
    res.json({ msg: "role updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await roleService.destroy(id);
    res.json({ msg: "role delete successfully" });
  } catch (error) {
    next(error);
  }
};
