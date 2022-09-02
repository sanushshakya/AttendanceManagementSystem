const _ = require("lodash");
const { Op } = require("sequelize");

const vars = require("../configs/vars.configs");
const { User, Role, SupervisorStaff, sequelize } = require("../models");
const { hashPasswordAsync } = require("../utils/bcrypt.utils");
const {
  NotFoundError,
  AlreadyExistsError,
  UserSideError,
} = require("../utils/exceptions.utils");
const { scheduleSendMail } = require("../utils/scheduleMail.utils");
const {
  generateRandomPassword,
} = require("../utils/generateRandomPassword.utils");
const { resizeImage } = require("../utils/resizeImage.utils");

class UserService {
  async getById(id) {
    const userInDB = await User.findOne({
      attributes: { exclude: ["current_login", "role_id", "password"] },
      where: { id },
      include: [
        { model: Role, as: "role", attributes: ["id", "role_name"] },
        {
          model: User,
          as: "supervisors",
          required: false,
          attributes: ["id", "first_name", "last_name", "email", "designation"],
          through: {
            model: SupervisorStaff,
            attributes: [],
          },
        },
      ],
    });

    if (!userInDB) throw new NotFoundError("user not found");

    return userInDB;
  }

  async getAll(options) {
    const { limit, page, name, role, supervisor_id, is_supervisor, is_admin } =
      _.pick(options, [
        "limit",
        "page",
        "name",
        "role",
        "supervisor_id",
        "is_supervisor",
        "is_admin",
      ]);

    /**
     * filter options
     * date:
     *   "2022/4/4" || "2022/4" || "2022"
     * attendeeId:
     */

    const queryOptions = [];

    if (name) {
      const nameSplit = name.split(" ");
      const nameQueries = [];

      nameSplit.forEach((name) => {
        nameQueries.push(
          sequelize.where(sequelize.col("first_name"), "LIKE", `%${name}%`)
        );
        nameQueries.push(
          sequelize.where(sequelize.col("last_name"), "LIKE", `%${name}%`)
        );
      });

      queryOptions.push(sequelize.or(...nameQueries));
    }

    if (role) {
      queryOptions.push(
        sequelize.where(sequelize.col("role.role_name"), "=", role)
      );
    }

    if (supervisor_id) {
      queryOptions.push(
        sequelize.where(
          sequelize.col("supervisors.id"),
          "=",
          parseInt(supervisor_id)
        )
      );
    }

    if (is_admin) {
      queryOptions.push(
        sequelize.where(sequelize.col("role.role_name"), "=", "admin")
      );
    }

    if (is_supervisor) {
      queryOptions.push(
        sequelize.literal(
          `EXISTS (SELECT * FROM supervisor_staff WHERE supervisor_id = User.id)`
        )
      );
    }

    const newLimit = limit || 100;
    const newPage = page || 1;

    // const supervisorStaffInDB = await SupervisorStaff.findAll({
    //   attributes: [],
    //   include: [
    //     {
    //       model: User,
    //       as: "staff",
    //       include: [
    //         {
    //           model: Role,
    //           as: "role",
    //         },
    //         {
    //           model: User,
    //           as: "supervisors",
    //           required: false,
    //           attributes: [
    //             "id",
    //             "first_name",
    //             "last_name",
    //             "email",
    //             "designation",
    //           ],
    //           through: {
    //             model: SupervisorStaff,
    //             attributes: [],
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   where: {
    //      supervisor_id: 1,
    //   },
    // });

    const userInDB = await User.findAll({
      order: [["created_at", "DESC"]],
      offset: (newPage - 1) * newLimit,
      limit: newLimit,
      subQuery: false,
      attributes: { exclude: ["current_login", "role_id", "password"] },
      include: [
        {
          model: Role,
          attributes: ["id", "role_name"],
          as: "role",
        },
        {
          model: User,
          as: "supervisors",
          attributes: ["id", "first_name", "last_name", "email", "designation"],
          through: {
            model: SupervisorStaff,
            attributes: [],
          },
        },
      ],
      where: {
        [Op.and]: queryOptions,
      },
    });

    return userInDB;
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.email
   * @param {integer} data.supervisor_id
   * @param {string} data.first_name
   * @param {string} data.last_name
   * @param {string} data.designation
   * @param {string} data.role_id
   */
  async create(data) {
    let userInDB = await User.findOne({ where: { email: data.email } });

    if (userInDB) throw new AlreadyExistsError("user already exists");

    let supervisorId = null;

    if (data.supervisor_id) {
      // check if supervisor exists in db
      const supervisorInDB = await User.findOne({
        where: { id: data.supervisor_id },
      });

      if (!supervisorInDB) throw new UserSideError("invalid supervisor_id");

      supervisorId = data.supervisor_id;
      delete data.supervisor_id;
    }

    const randomPassword = generateRandomPassword();
    const password = await hashPasswordAsync(randomPassword);

    userInDB = await User.create({ ...data, password });

    supervisorId && this.assignSupervisorTo(supervisorId, userInDB.id);

    scheduleSendMail({
      to: data.email,
      subject:
        "You have been successfully registered to Hajiri Attendance Management System",
      html: `
      <p>You has been successfully registered in Hajiri Attendance Management System</p>
      <br/>
      <p>your initial password is <strong><i>${randomPassword}</i></strong>, please change it as soon as you can</p>
      <br/>
      <br/>
      Sincerely,
      <br/>
      The Hajiri Team
      `,
    });
  }

  async update(id, data) {
    const userInDB = await User.findOne({ where: { id } });

    if (!userInDB) throw new NotFoundError("user not found");

    if (data.supervisor_id) {
      let supervisorId = data.supervisor_id;
      delete data.supervisor_id;

      // check if supervisor exists in db
      const supervisorInDB = await User.findOne({
        where: { id: data.supervisorId },
      });

      if (!supervisorInDB) throw new UserSideError("invalid supervisor_id");

      // if staff had a supervisor previously then remove that first
      // TODO : currently only 1 supervisor for one staff
      if (await this.hasSupervisor(userInDB.id)) {
        await this.unAssignAllSupervisors(userInDB.id);
      }
      await this.assignSupervisor(supervisorId, userInDB.id);
    }

    let updateData = {};

    const updateFunc = async () =>
      Object.keys(data).forEach(async (key) => {
        if (data[key]) {
          if (key === "password") {
            updateData[key] = await hashPasswordAsync(data[key]);
          } else {
            updateData[key] = data[key];
          }
        }
      });

    await updateFunc();

    await User.update(updateData, { where: { id } });
  }

  async destroy(id) {
    const userInDB = await User.findOne({ where: { id } });

    if (!userInDB) throw new NotFoundError("user not found");

    await User.destroy({ where: { id } });
  }

  async hasSupervisor(staffId) {
    const supervisorStaffInDB = await SupervisorStaff.findOne({
      where: {
        staff_id: staffId,
      },
    });

    return !!supervisorStaffInDB;
  }

  async isSupervisor(staffId) {
    const supervisorStaffInDB = await SupervisorStaff.findOne({
      where: { supervisor_id: staffId },
    });

    return !!supervisorStaffInDB;
  }

  async isAdmin(staffId) {
    const staffInDB = await User.findOne({
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["role_name"],
        },
      ],
      where: { id: staffId },
    });

    return staffInDB.role.role_name === "admin" ? true : false;
  }

  async isSupervisorOf(supervisorId, staffId) {
    const supervisorStaffInDB = await SupervisorStaff.findOne({
      where: {
        supervisor_id: supervisorId,
        staff_id: staffId,
      },
    });

    return !!supervisorStaffInDB;
  }

  async assignSupervisorTo(supervisorId, staffId) {
    const supervisorInDB = await User.findOne({ where: { id: supervisorId } });
    if (!supervisorInDB) throw new NotFoundError("supervisor dose not exists");

    const staffInDB = await User.findOne({ where: { id: staffId } });
    if (!staffInDB) throw new NotFoundError("staff dose not exists");

    await SupervisorStaff.create({
      supervisor_id: supervisorId,
      staff_id: staffId,
    });

    await User.update({ is_supervisor: true }, { where: { id: supervisorId } });

    scheduleSendMail({
      to: supervisorInDB.email,
      subject: "A staff has been assigned to you",
      html: `
      <p>A staff has been assigned to you</p>
      <br/>
      <p>${staffInDB.first_name} ${staffInDB.last_name} has been assigned to you</p>
      <br/>
      <br/>
      Sincerely,
      <br/>
      The Hajiri Team
      `,
    });
  }

  async unAssignSupervisorTo(supervisorId, staffId) {
    const supervisorInDB = await User.findOne({ where: { id: supervisorId } });
    if (!supervisorInDB) throw new NotFoundError("supervisor dose not exists");

    const staffInDB = await User.findOne({ where: { id: staffId } });
    if (!staffInDB) throw new NotFoundError("staff dose not exists");

    if (!(await this.isSupervisorOf(supervisorId, staffId)))
      throw new UserSideError("user is not the supervisor of the staff");

    await SupervisorStaff.destroy({
      where: { supervisor_id: supervisorId, staff_id: staffId },
    });

    // TODO: for only 1 supervisor per user
    await User.update(
      { is_supervisor: false },
      { where: { id: supervisorId } }
    );

    scheduleSendMail({
      to: supervisorInDB.email,
      subject: "A staff has been un-assigned to you",
      html: `
      <p>A staff has been un-assigned to you</p>
      <br/>
      <p>${staffInDB.first_name} ${staffInDB.last_name} has been un-assigned to you</p>
      <br/>
      <br/>
      Sincerely,
      <br/>
      The Hajiri Team
      `,
    });
  }

  async unAssignAllSupervisors(staffId) {
    const staffInDB = await User.findOne({ where: { id: staffId } });
    if (!staffInDB) throw new NotFoundError("staff dose not exists");

    const supervisorStaffInDB = await SupervisorStaff.findAll({
      where: {
        staff_id: staffId,
      },
    });

    if (supervisorStaffInDB.length === 0) return;

    supervisorStaffInDB.forEach(
      async (ss) => await this.unAssignSupervisorTo(ss.supervisor_id, staffId)
    );
  }

  async uploadDP(staffId, image) {
    await resizeImage(image);

    const imageUrl = `${vars.static_base_url}/images/resized/${image.filename}`;

    await User.update(
      {
        image_url: imageUrl,
      },
      { where: { id: staffId } }
    );
  }
}

module.exports = new UserService();
