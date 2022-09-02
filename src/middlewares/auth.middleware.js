const { validateToken } = require("../utils/jwt.utils");
const { UserSideError } = require("../utils/exceptions.utils");
const userService = require("../services/user.services");

exports.checkAuth = (userRole = []) => {
  // TODO: add check for yourself
  if (!Array.isArray(userRoles)) {
    userRole = [userRole];
  }

  // return another middleware
  return async (req, res, next) => {
    try {
      const token =
        req.headers["Authorization"] || req.headers["authorization"];

      if (!token) {
        throw new UserSideError("you are not authorized", 401);
      }

      if (token.indexOf("Bearer") !== 0)
        throw new UserSideError("token format invalid");

      const tokenString = req.headers.authorization.split(" ")[1];

      const decoded = await validateToken(tokenString);
      if (decoded.error) throw new UserSideError("you are not authorized", 401);

      const userInDB = await userService.getById(decoded.data.id);
      req.user = userInDB;

      if (userRole.length === 0) return next();

      if (!userRole.includes(decoded.data.role_name)) {
        throw new UserSideError("you are not authorized", 401);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};
