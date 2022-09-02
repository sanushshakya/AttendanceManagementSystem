const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const leaveRecordController = require("../controllers/leaveRecord.controller");

/**
 * @swagger
 *
 * /leave-records:
 *   get:
 *     tags: [Leave]
 *     summary: get all leave records
 *     parameters:
 *         - name: limit
 *           in: query
 *           description: limit of data
 *           type: integer
 *
 *         - name: page
 *           in: query
 *           description: page number
 *           type: integer
 *
 *         - name: from
 *           in: query
 *           description: from date
 *           type: string

 *         - name: till
 *           in: query
 *           description: till date
 *           type: string
 *
 *         - name: staff_id
 *           in: query
 *           description: filter by staff id
 *           type: integer
 *     responses:
 *         '200':
 *             description: leave records
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
 *                                      from:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      till:
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
 *
 * /leave-records/{id}:
 *   get:
 *     tags: [Leave]
 *     summary: get attendance record by id
 *     responses:
 *         '200':
 *             description: leave record by id
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
 *                                  from:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  till:
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

router.get("/", checkAuth(), leaveRecordController.getAll);
router.get("/:id", checkAuth(), leaveRecordController.get);

module.exports = { leaveRecordRouter: router };
