const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const holidayController = require("../controllers/holiday.controller");

/**
 * @swagger
 *
 * /holiday:
 *   post:
 *     tags: [Holiday]
 *     summary: create holiday
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          reason:
 *                              type: string
 *                              example: reason title
 *                          date:
 *                              type: string
 *                              example: reason description
 *     responses:
 *         '200':
 *             description: holiday created
 *         '500':
 *             description: internal server error
 *   get:
 *     tags: [Holiday]
 *     summary: get all holidays
 *     responses:
 *         '200':
 *             description: holidays
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
 *                                      reason:
 *                                          type: string
 *                                          example: 1
 *                                      date:
 *                                          type: string
 *                                          example: 1
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
 * /holiday/{id}:
 *   get:
 *     tags: [Holiday]
 *     summary: get holiday by id
 *     responses:
 *         '200':
 *             description: holiday by id
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
 *                                  date:
 *                                      type: string
 *                                      example: 1
 *                                  reason:
 *                                      type: string
 *                                      example: 1
 *                                  created_at:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  updated_at:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *         '500':
 *             description: internal server error
 */

router.post("/", checkAuth(["admin"]), holidayController.create);
router.get("/", checkAuth(), holidayController.getAll);
router.get("/:id", checkAuth(), holidayController.get);

module.exports = { holidayRouter: router };
