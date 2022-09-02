const router = require("express").Router();

const { checkAuth } = require("../middlewares/auth.middleware");
const settingController = require("../controllers/setting.controller");

/**
 * @openapi
 * /settings:
 *   get:
 *     tags: [Setting]
 *     summary: returns settings
 *     responses:
 *        '200':
 *            description: A JSON with  settings
 *            content:
 *              application/json:
 *                  schema:
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
 *                                      weekends:
 *                                          type: string
 *        '500':
 *            description: internal server error
 *
 *
 * /settings/add-weekend:
 *   post:
 *       tags: [Setting]
 *       summary: add weekend
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                          week_day:
 *                              type: number
 *       responses:
 *           '200':
 *               description: setting updated
 *           '404':
 *               description: setting doesn't exist
 *           '409':
 *               description: setting already exists
 *           '500':
 *               description: internal server error
 *
 * /settings/remove-weekend:
 *   post:
 *       tags: [Setting]
 *       summary: remove weekend
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                          week_day:
 *                              type: number
 *       responses:
 *           '200':
 *               description: setting updated
 *           '404':
 *               description: setting doesn't exist
 *           '409':
 *               description: setting already exists
 *           '500':
 *               description: internal server error
 */

router.get("/", settingController.get);
router.post("/add-weekend", checkAuth(["admin"]), settingController.addWeekend);
router.post(
  "/remove-weekend",
  checkAuth(["admin"]),
  settingController.removeWeekend
);

module.exports = { settingRouter: router };
