const router = require("express").Router();
const { upload } = require("../middlewares/multer.middleware");
const { checkAuth } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validators");
const userValidators = require("../middlewares/validators/user.validator");
/**
 * @swagger
 * tags:
 *  name: User
 *  description: routes for user management
 *
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              data:
 *                   type: object
 *                   properties:
 *                       id:
 *                           type: integer
 *                           example: 1
 *                       supervisor_id:
 *                           type: integer
 *                           example: 2
 *                       first_name:
 *                           type: string
 *                           example: john
 *                       last_name:
 *                           type: string
 *                           example: doe
 *                       email:
 *                           type: string
 *                           example: "john@example.com"
 *                       role:
 *                           type: object
 *                           properties:
 *                               id:
 *                                   type: integer
 *                                   example: 1
 *                               role_name:
 *                                   type: string
 *                                   example: admin
 *                       designation:
 *                           type: string
 *                           example: manager
 *
 *      Users:
 *          type: object
 *          properties:
 *              data:
 *                  type: array
 *                  items:
 *                       type: object
 *                       properties:
 *                           id:
 *                               type: integer
 *                               example: 1
 *                           supervisor_id:
 *                               type: integer
 *                               example: 2
 *                           first_name:
 *                               type: string
 *                               example: john
 *                           last_name:
 *                               type: string
 *                               example: doe
 *                           email:
 *                               type: string
 *                               example: "john@example.com"
 *                           role:
 *                               type: object
 *                               properties:
 *                                   id:
 *                                       type: integer
 *                                       example: 1
 *                                   role_name:
 *                                       type: string
 *                                       example: admin
 *                           designation:
 *                               type: string
 *                               example: manager
 *
 * /users:
 *   get:
 *     tags: [User]
 *     summary: returns all users
 *     parameters:
 *         - name: name
 *           in: query
 *           description: filter by name
 *           type: string
 *         - name: role
 *           in: query
 *           description: filter by role
 *           type: string
 *         - name: supervisor_id
 *           in: query
 *           description: filter by supervisor_id
 *           type: string
 *         - name: is_supervisor
 *           in: query
 *           description: filter all users who are supervisor
 *           type: boolean
 *         - name: is_admin
 *           in: query
 *           description: filter all users who are admin
 *           type: boolean
 *     responses:
 *        '200':
 *            description: A JSON with array of available users
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Users'
 *        '500':
 *            description: internal server error
 *   post:
 *     tags: [User]
 *     summary: add a new user
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          first_name:
 *                              type: string
 *                              example: john
 *                          last_name:
 *                              type: string
 *                              example: doe
 *                          email:
 *                              type: string
 *                              example: john@example.com
 *                          role_id:
 *                              type: integer
 *                              example: 1
 *                          supervisor_id:
 *                              type: integer
 *                              example: 1
 *                          designation:
 *                              type: string
 *                              example: manager
 *     responses:
 *         '200':
 *             description: user created
 *         '404':
 *             description: user already exists
 *         '500':
 *             description: internal server error
 *
 * /users/{id}/upload-dp:
 *   post:
 *      tags: [User]
 *      summary: upload image
 *      consumes:
 *        - multipart/form-data
 *      parameters:
 *        - in: path
 *          name: id
 *          type: number
 *
 *        - in: formData
 *          name: file
 *          type: file
 *          description: The file to upload.
 *
 *      responses:
 *         '200':
 *             description: user created
 *         '404':
 *             description: user already exists
 *         '500':
 *             description: internal server error
 *
 * /users/me:
 *   get:
 *     tags: [User]
 *     summary: returns all users
 *     responses:
 *        '200':
 *            description: A JSON with array of available users
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *        '500':
 *            description: internal server error
 *
 * /users/{userId}:
 *   get:
 *     tags: [User]
 *     summary: returns all users
 *     parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           description: the id of the user to get
 *     responses:
 *        '200':
 *            description: A JSON with array of available users
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *        '500':
 *            description: internal server error
 *   delete:
 *       tags: [User]
 *       summary: delete a user
 *       parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           description: the id of the user to delete
 *       responses:
 *           '200':
 *               description: user deleted
 *           '404':
 *               description: user doesn't exist
 *           '500':
 *               description: internal server error
 *
 *   put:
 *       tags: [User]
 *       summary: update a user
 *       parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           description: the id of the user to update
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                          first_name:
 *                              type: string
 *                              example: john
 *                          last_name:
 *                              type: string
 *                              example: doe
 *                          email:
 *                              type: string
 *                              example: john@example.com
 *                          password:
 *                              type: string
 *                              example: password
 *                          role_id:
 *                              type: integer
 *                              example: 1
 *                          supervisor_id:
 *                              type: integer
 *                              example: 1
 *                          designation:
 *                              type: string
 *                              example: manager
 *       responses:
 *           '200':
 *               description: user updated
 *           '404':
 *               description: user doesn't exist
 *           '409':
 *               description: user already exists
 *           '500':
 *               description: internal server error
 */

router.get("/", checkAuth(["admin"]), userController.getAll);
router.get("/me", checkAuth(), userController.getMe);
router.post(
  "/:id/upload-dp",
  checkAuth(),
  upload.single("image"),
  userController.uploadDP
);
router.get("/:id", checkAuth(), userController.get);
router.post(
  "/",
  validate(userValidators.create()),
  checkAuth(["admin"]),
  userController.create
);
router.put(
  "/:id",
  validate(userValidators.update()),
  checkAuth(["admin"]),
  userController.update
);
router.delete("/:id", checkAuth(["admin"]), userController.delete);

module.exports = { userRouter: router };
