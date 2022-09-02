const _ = require("lodash");
const { Role } = require("../models");
const {
  NotFoundError,
  AlreadyExistsError,
} = require("../utils/exceptions.utils");

class RoleServices {
  async getById(id) {
    const roleInDB = await Role.findOne({
      where: {
        id,
      },
    });

    if (!roleInDB) throw new NotFoundError("role not found");

    return {
      id: roleInDB.id,
      role_name: roleInDB.role_name,
    };
  }

  async getAll(options) {
    const roleInDB = await Role.findAll({
      attributes: ["id", "role_name"],
      raw: true,
    });

    return roleInDB;
  }

  async create(role) {
    const roleInDB = await Role.findOne({ where: { ...role } });

    if (roleInDB) throw new AlreadyExistsError("role already exists"); //role already existed

    await Role.create({ ...role });
  }

  async update(id, role) {
    const roleInDB = await Role.findOne({ where: { id } });

    if (!roleInDB) throw new NotFoundError("role not found"); //Role not found

    await Role.update({ role_name: role }, { where: { id } });
  }

  async destroy(id) {
    const roleInDB = await Role.findOne({ where: { id } });

    if (!roleInDB) throw new NotFoundError("role not found"); //Role not found

    await Role.destroy({ where: { id } });
  }
}

module.exports = new RoleServices();
