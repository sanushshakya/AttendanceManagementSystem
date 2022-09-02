const router = require("express").Router();
const { checkAuth } = require("../middlewares/auth.middleware");

const breakRecordController = require("../controllers/breakRecord.controller");

/**
 * @swagger
 *
 * /break-records:
 *   get:
 *     tags: [Break]
 *     summary: get all break records
 *     parameters:
 *        - name: date
 *          in: query
 *          description: filter by date
 *          type: integer

 *        - name: staff_id
 *          in: query
 *          description: filter by staff id
 *          type: integer
 *
 *     responses:
 *         '200':
 *             description: break records
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
 *                                      date:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      start:
 *                                          type: string
 *                                          example: 2022-03-03T06:00:00.000Z
 *                                      end:
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
 * /break-records/{id}:
 *   get:
 *     tags: [Break]
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
 *                                  start:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  end:
 *                                      type: string
 *                                      example: 2022-03-03T06:00:00.000Z
 *                                  date:
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
 * /break-records/break-start:
 *      post:
 *          summary: start break
 *          tags: [Break]
 *
 *          responses:
 *              200:
 *                  description: success message
 *
 * /break-records/break-end:
 *      post:
 *          summary: end break
 *          tags: [Break]
 *          responses:
 *              200:
 *                  description: success message
 */

router.get("/", checkAuth(), breakRecordController.getAll);
router.get("/:id", checkAuth(), breakRecordController.get);
router.post("/break-start", checkAuth(), breakRecordController.breakStart);
router.post("/break-end", checkAuth(), breakRecordController.breakEnd);

module.exports = { breakRecordRouter: router };
