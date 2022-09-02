const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const { validate } = require("../middlewares/validators");
const attendanceValidators = require("../middlewares/validators/attendance.validator");
const attendanceController = require("../controllers/attendance.controller");

/**
 * @swagger
 * components:
 *  schemas:
 *      Attendance:
 *          type: object
 *          properties:
 *              data:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                          description: attendance id
 *                          example: 1
 *                      staff_id:
 *                          type: integer
 *                          description: attendee id
 *                          example: 1
 *                      check_in:
 *                          type: string
 *                          description: time when attendee check in
 *                          example: 2022-03-03T06:10:24.000Z
 *                      check_out:
 *                          type: string
 *                          description: time when attendee check out
 *                          example: 2022-03-03T06:10:24.000Z
 *                      date:
 *                          type: string
 *                          description: date of the attendance
 *                          example: 2022-03-03T06:00:00.000Z
 *                      total_time:
 *                         type: float
 *                         description: total time between check in and out in that day in seconds
 *                         example: 125000
 *                      created_at:
 *                          type: string
 *                          description: created at
 *                          example: 2022-03-03T06:00:00.000Z
 *                      updated_at:
 *                          type: string
 *                          description: updated at
 *                          example: 2022-03-03T06:00:00.000Z
 *
 *      Attendances:
 *          type: object
 *          properties:
 *              data:
 *                   type: array
 *                   items:
 *                       type: object
 *                       properties:
 *                            id:
 *                                type: integer
 *                                description: attendance id
 *                                example: 1
 *                            staff_id:
 *                                type: integer
 *                                description: attendee id
 *                                example: 1
 *                            status:
 *                                type: integer
 *                                description: status of attendance
 *                                example: 1
 *                            check_in:
 *                                type: string
 *                                description: time when attendee check in
 *                                example: 2022-03-03T06:10:24.000Z
 *                            check_out:
 *                                type: string
 *                                description: time when attendee check out
 *                                example: 2022-03-03T06:10:24.000Z
 *                            date:
 *                                type: string
 *                                description: date of the attendance
 *                                example: 2022-03-03T06:00:00.000Z
 *                            total_time:
 *                                type: float
 *                                description: total time between check in and out in that day in seconds
 *                                example: 125000
 *                            created_at:
 *                                type: string
 *                                description: created at
 *                                example: 2022-03-03T06:00:00.000Z
 *                            updated_at:
 *                                type: string
 *                                description: updated at
 *                                example: 2022-03-03T06:00:00.000Z
 *
 * /attendances:
 *      get:
 *          summary: get all the attendance
 *          tags: [Attendance]
 *          parameters:
 *              - name: limit
 *                in: query
 *                description: limit of data
 *                type: integer
 *
 *              - name: page
 *                in: query
 *                description: page number
 *                type: integer
 *
 *              - name: from
 *                in: query
 *                description: from date
 *                type: string

 *              - name: till
 *                in: query
 *                description: till date
 *                type: string
 *
 *              - name: staff_id
 *                in: query
 *                description: filter by staff id
 *                type: integer
 *          responses:
 *              200:
 *                  description: list of attendances
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Attendances'
 *              500:
 *                  description: server error
 *                  content:
 *                      application/json:
 *                          schema:
 *                            type: object
 *                            properties:
 *                              msg:
 *                                type: string
 *                                example: something went wrong
 *
 * /attendances/{id}:
 *      get:
 *          summary: get attendance by id
 *          tags: [Attendance]
 *          parameters:
 *          -   in: path
 *              name: id
 *              require: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: attendance by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Attendance'
 *      put:
 *          summary: update attendance
 *          tags: [Attendance]
 *          parameters:
 *          -   in: path
 *              name: id
 *              description: attendance id
 *              require: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              staff_id:
 *                                  type: number
 *                                  description: id of the attendee who is checking in
 *                                  example: 1
 *                              date:
 *                                  type: string
 *                                  description: date of the attendance
 *                                  example: 2022-03-03T06:00:00.000Z
 *                              check_in:
 *                                  type: string
 *                                  description: date when attendee checked in
 *                                  example: 2022-03-03T06:00:00.000Z
 *                              check_out:
 *                                  type: string
 *                                  description: date when attendee checked out
 *                                  example: 2022-03-03T06:00:00.000Z
 *                              total_time:
 *                                  type: float
 *                                  description: total time between check in and out
 *                                  example: 304223
 *          responses:
 *              200:
 *                  description: success message
 *      delete:
 *          summary: delete attendance
 *          tags: [Attendance]
 *          parameters:
 *          -   in: path
 *              name: id
 *              description: attendance id
 *              require: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: success message
 *
 * /attendances/check-in:
 *      post:
 *          summary: check in attendee
 *          tags: [Attendance]
 *
 *          responses:
 *              200:
 *                  description: success message
 *
 * /attendances/check-out:
 *      post:
 *          summary: check out attendee
 *          tags: [Attendance]
 *          responses:
 *              200:
 *                  description: success message
 *
 */
router.get("/", attendanceController.getAll);

router.get("/:id", attendanceController.get);

router.put(
  "/:id",
  checkAuth(),
  validate(attendanceValidators.updateAttendance()),
  attendanceController.update
);

router.delete("/:id", checkAuth(), attendanceController.delete);

router.post("/check-in", checkAuth(), attendanceController.checkIn);

router.post("/check-out", checkAuth(), attendanceController.checkOut);

module.exports = { attendanceRouter: router };
