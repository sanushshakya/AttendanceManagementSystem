const vars = require("./configs/vars.configs");
const { scheduleTaskEveryDay } = require("./utils/crone.utils");
const { User, Role } = require("./models");
const userService = require("./services/user.services");
const absentRecordService = require("./services/absentRecord.services");
const logger = require("./utils/logger.utils");
const { dbConnect } = require("./utils/db.utils");
const { scheduleEndDay } = require("./utils/scheduleEndDay.utils");

module.exports = async () => {
  try {
    /**
     * database init
     */
    await dbConnect();

    // create superuser if not exist
    const superUserInDB = await User.findOne({
      where: {
        email: vars.superuser.email,
      },
    });

    if (!superUserInDB) {
      const roleInDB = await Role.findOne({
        where: {
          role_name: "admin",
        },
      });

      await userService.create({
        first_name: "super",
        last_name: "user",
        email: vars.superuser.email,
        password: vars.superuser.pass,
        role_id: roleInDB.id,
        designation: "Super User",
      });
    }

    scheduleEndDay();
  } catch (error) {
    logger.error(error);
  }
};
