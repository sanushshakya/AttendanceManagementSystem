const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const leaveRequestController = require("../controllers/leaveRequest.controller");

/**
 * @swagger
 * /leave-requests:
 *   post:
 *     tags: [Leave]
 *     summary: create leave request
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
 *                          from:
 *                              type: string
 *                              example: 2022-03-03T06:00:00.000Z
 *                          till:
 *                              type: string
 *                              example: 2022-03-03T06:00:00.000Z
 *     responses:
 *         '200':
 *             description: leave request created
 *         '500':
 *             description: internal server error
 *
 *   get:
 *     tags: [Leave]
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
 *             description: leave requests
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
 *                                      from:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      till:
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
 * /leave-requests/{id}/approve:
 *   post:
 *     tags: [Leave]
 *     summary: approve leave request
 *     parameters:
 *     -   in: path
 *         name: id
 *         description: leave request id
 *         require: true
 *         schema:
 *             type: integer
 *     responses:
 *         '200':
 *             description: leave request approved successfully
 *         '500':
 *             description: internal server error

 * /leave-requests/{id}/decline:
 *   post:
 *     tags: [Leave]
 *     summary: decline leave request
 *     parameters:
 *     -   in: path
 *         name: id
 *         description: leave request id
 *         require: true
 *         schema:
 *             type: integer
 *     responses:
 *         '200':
 *             description: leave request decline successfully
 *         '500':
 *             description: internal server error
 *
 * /leave-requests/{id}:
 *   get:
 *     tags: [Leave]
 *     summary: get attendance request by id
 *     responses:
 *         '200':
 *             description: leave requests
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
 *                                  from:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  till:
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

router.post("/", checkAuth(), leaveRequestController.create);
router.post(
  "/:id/approve",
  checkAuth(),
  leaveRequestController.approveLeaveRequest
);
router.post(
  "/:id/decline",
  checkAuth(),
  leaveRequestController.declineLeaveRequest
);
router.get("/", checkAuth(), leaveRequestController.getAll);
router.get("/:id", checkAuth(), leaveRequestController.get);

module.exports = { leaveRequestRouter: router };
