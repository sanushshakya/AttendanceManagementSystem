const _ = require("lodash");
const userService = require("../services/user.services");

exports.getAll = async (req, res, next) => {
  try {
    const {
      limit,
      offset,
      name,
      role,
      supervisor_id,
      is_supervisor,
      is_admin,
    } = req.query;
    const user = await userService.getAll({
      limit: +limit,
      offset: +offset,
      name,
      role,
      supervisor_id,
      is_supervisor,
      is_admin,
    });
    return res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    return res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const userInDB = await userService.getById(user.id);

    return res.json({ data: userInDB });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = _.pick(req.body, [
      "first_name",
      "last_name",
      "email",
      "role_id",
      "supervisor_id",
      "designation",
    ]);
    await userService.create(user);
    res.status(201).json({ msg: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = _.pick(req.body, [
      "first_name",
      "last_name",
      "email",
      "password",
      "role_id",
      "supervisor_id",
      "designation",
    ]);
    await userService.update(id, user);
    res.json({ msg: "user updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.destroy(id);
    res.json({ msg: "user delete successfully" });
  } catch (error) {
    next(error);
  }
};

exports.uploadDP = async (req, res) => {
  const image = req.file;
  const user = req.user;

  await userService.uploadDP(user.id, image);

  res.json({ message: "image uploaded successfully." });
};
