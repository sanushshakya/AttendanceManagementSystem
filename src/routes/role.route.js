const router = require("express").Router();

const { checkAuth } = require("../middlewares/auth.middleware");
const roleController = require("../controllers/role.controller");

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Role]
 *     summary: returns all roles
 *     responses:
 *        '200':
 *            description: A JSON with array of available roles
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
 *                                      role_name:
 *                                          type: string
 *                                          example: staff
 *        '500':
 *            description: internal server error
 *
 *   post:
 *     tags: [Role]
 *     summary: add a new role
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          role_name:
 *                              type: string
 *                              example: staff
 *     responses:
 *         '200':
 *             description: role created
 *         '404':
 *             description: role already exists
 *         '500':
 *             description: internal server error
 *
 *
 * /roles/{roleId}:
 *   get:
 *     tags: [Role]
 *     summary: returns all roles
 *     parameters:
 *         - name: roleId
 *           in: path
 *           required: true
 *           description: the id of the role to show
 *     responses:
 *        '200':
 *            description: A JSON with array of available roles
 *            content:
 *              application/json:
 *                  schema:
 *                        type: object
 *                        properties:
 *                          data:
 *                               type: object
 *                               properties:
 *                                   id:
 *                                       type: integer
 *                                       example: 1
 *                                   role_name:
 *                                       type: string
 *                                       example: staff
 *
 *        '500':
 *            description: internal server error
 *        '404':
 *            description: role not found
 *   delete:
 *       tags: [Role]
 *       summary: delete a role
 *       parameters:
 *         - name: roleId
 *           in: path
 *           required: true
 *           description: the id of the role to delete
 *       responses:
 *           '200':
 *               description: role deleted
 *           '404':
 *               description: role doesn't exist
 *           '500':
 *               description: internal server error
 *
 *   put:
 *       tags: [Role]
 *       summary: update a role
 *       parameters:
 *         - name: roleId
 *           in: path
 *           required: true
 *           description: the id of the role to update
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                          role_name:
 *                              type: string
 *                              example: staff
 *       responses:
 *           '200':
 *               description: role updated
 *           '404':
 *               description: role doesn't exist
 *           '409':
 *               description: role already exists
 *           '500':
 *               description: internal server error
 *
 */

router.get("/", roleController.getAll);
router.get("/:id", roleController.get);
router.post("/", checkAuth(["admin"]), roleController.create);
router.put("/:id", checkAuth(["admin"]), roleController.update);
router.delete("/:id", checkAuth(["admin"]), roleController.delete);

module.exports = { roleRouter: router };
