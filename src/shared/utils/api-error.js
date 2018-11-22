/**
 * @name ApiError
 * @description This class prototype for creating ApiError Objects
 */
class ApiError extends Error {
  constructor(message = "Internal Server Error", status = 500) {
    super(message);

    this.message = message;
    this.status = status;
  }
}

module.exports = ApiError;
