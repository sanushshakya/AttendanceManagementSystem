/**
 * 401: Invalid Credentials */
class InvalidCredentials extends Error {
  constructor(message) {
    super(message);
    this.name = "INVALID_CREDENTIALS";
    this.message = message || "resource invalid";
    this.status = 401;
  }
}
/**
 * 404: Not Found
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_FOUND_ERROR";
    this.message = message || "resource not found";
    this.status = 404;
  }
}
/**
 * 409: Already Exists
 */
class AlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ALREADY_EXISTS";
    this.message = message || "resource already existed";
    this.status = 409;
  }
}

/**
 * >=500 : All Server Errors
 */
class ServerSideError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "SERVER_SIDE_ERROR";
    this.message = message || "something went wrong";
    this.status = status || 500;
  }
}

/**
 * >=400 <500: All Client Side Errors
 */
class UserSideError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "USER_SIDE_ERROR";
    this.message = message || "something went wrong";
    this.status = status || 400;
  }
}

module.exports = {
  InvalidCredentials,
  NotFoundError,
  ServerSideError,
  UserSideError,
  AlreadyExistsError,
};
