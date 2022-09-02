const router = require("express").Router();

const { attendanceRouter } = require("./attendance.route");
const { attendanceRequestRouter } = require("./attendanceRequest.route");
const { leaveRequestRouter } = require("./leaveRequest.route");
const { leaveRecordRouter } = require("./leaveRecord.route");
const { absentRecordRouter } = require("./absentRecord.route");
const { breakRecordRouter } = require("./breakRecord.route");
const { holidayRouter } = require("./holiday.route");
const { userRouter } = require("./user.route");
const { roleRouter } = require("./role.route");
const { authRouter } = require("./auth.route");
const { settingRouter } = require("./setting.route");

router.use("/attendances", attendanceRouter);
router.use("/attendance-requests", attendanceRequestRouter);
router.use("/leave-requests", leaveRequestRouter);
router.use("/leave-records", leaveRecordRouter);
router.use("/absent-records", absentRecordRouter);
router.use("/break-records", breakRecordRouter);
router.use("/holiday", holidayRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/auth", authRouter);
router.use("/settings", settingRouter);

module.exports = router;
