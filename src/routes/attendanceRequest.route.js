const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const attendanceRequestController = require("../controllers/attendanceRequest.controller");

/**
 * @swagger
 * /attendance-requests:
 *   post:
 *     tags: [Attendance]
 *     summary: create attendance request
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          reason_title:
 *                              type: string
 *                              example: reason title
 *                          reason_desc:
 *                              type: string
 *                              example: reason description
 *                          date:
 *                              type: string
 *                              example: 2022-03-03T06:00:00.000Z
 *                          check_in:
 *                              type: string
 *                              example: 2022-03-03T06:00:00.000Z
 *                          check_out:
 *                              type: string
 *                              example: 2022-03-03T06:00:00.000Z
 *     responses:
 *         '200':
 *             description: attendance request created
 *         '500':
 *             description: internal server error
 *
 *   get:
 *     tags: [Attendance]
 *     summary: get all attendance requests
 *     parameters:
 *     -   in: query
 *         name: limit
 *         description: limit
 *         require: true
 *         schema:
 *             type: number
 *     -   in: query
 *         name: page
 *         description: page
 *         require: true
 *         schema:
 *             type: number
 *     -   in: query
 *         name: approval_status
 *         description: approval status
 *         require: true
 *         schema:
 *             type: string
 *             example: "pending or approved or rejected"
 *     responses:
 *         '200':
 *             description: attendance requests
 *             content:
 *                 application/json:
 *                     schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          example: 1
 *                                      staff_id:
 *                                          type: integer
 *                                          example: 1
 *                                      reason_title:
 *                                          type: string
 *                                          example: reason title
 *                                      reason_desc:
 *                                          type: string
 *                                          example: reason desc
 *                                      date:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      check_in:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      check_out:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      approval_status:
 *                                          type: boolean
 *                                          example: false
 *                                      approval_date:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      created_at:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      updated_at:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *         '500':
 *             description: internal server error
 *
 * /attendance-requests/{id}/approve:
 *   post:
 *     tags: [Attendance]
 *     summary: approve attendance request
 *     parameters:
 *     -   in: path
 *         name: id
 *         description: attendance request id
 *         require: true
 *         schema:
 *             type: integer
 *     responses:
 *         '200':
 *             description: attendance request approved successfully
 *         '500':
 *             description: internal server error

 * /attendance-requests/{id}/decline:
 *   post:
 *     tags: [Attendance]
 *     summary: decline attendance request
 *     parameters:
 *     -   in: path
 *         name: id
 *         description: attendance request id
 *         require: true
 *         schema:
 *             type: integer
 *     responses:
 *         '200':
 *             description: attendance request decline successfully
 *         '500':
 *             description: internal server error
 *
 * /attendance-requests/{id}:
 *   get:
 *     tags: [Attendance]
 *     summary: get attendance request by id
 *     responses:
 *         '200':
 *             description: attendance requests
 *             content:
 *                 application/json:
 *                     schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  staff_id:
 *                                      type: integer
 *                                      example: 1
 *                                  reason_title:
 *                                      type: string
 *                                      example: reason title
 *                                  reason_desc:
 *                                      type: string
 *                                      example: reason desc
 *                                  date:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  check_in:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  check_out:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  approval_status:
 *                                      type: boolean
 *                                      example: false
 *                                  approval_date:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  created_at:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  updated_at:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *         '500':
 *             description: internal server error
 */

router.post("/", checkAuth(), attendanceRequestController.create);
router.post(
  "/:id/approve",
  checkAuth(),
  attendanceRequestController.approveAttendanceRequest
);
router.post(
  "/:id/decline",
  checkAuth(),
  attendanceRequestController.declineAttendanceRequest
);
router.get("/", checkAuth(), attendanceRequestController.getAll);
router.get("/:id", checkAuth(), attendanceRequestController.get);

module.exports = { attendanceRequestRouter: router };
