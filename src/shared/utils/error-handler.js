const winston = require("winston");

const ApiError = require("./api-error");

/**
 * @desc This function is used as middleware for express application for handling route errors
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next Middleware} next
 */
const errorHandler = (err, req, res, next) => {
  // trace request
  winston.log("info", `\nREQUEST HAS ERROR:${req.method}: ${req.url} \n`);

  logError(err);

  if (res.headersSent) {
    // response sending has already started
    res.end();
    winston.log(
      "warn",
      "errorHandler: Request headers already sent. Cannot respond with error."
    );
  } else if (err instanceof ApiError) {
    // Api error, just send details
    sendErrorResponse(err, res);
  } else {
    sendErrorResponse(new ApiError(inspectDetail(err)), res);
  }

  // next
  next();
};

module.exports = errorHandler;

/**
 * @description This function is used for logging the error
 * @param {Error} err
 */
const logError = err => {
  // log all errors
  if (err instanceof ApiError) {
    winston.log("warn", `API ERROR: ${err.message}\n`);
  } else if (err instanceof Error) {
    winston.log("error", `SERVER ERROR: ${err.message}\n`, err);
  } else {
    winston.log("error", `UNKNOWN ERROR: ${err.toString()}\n`);
  }
};

/**
 * @description This function send the error response to the client
 * @param {ApiError} apiError
 * @param {Response} res
 */
const sendErrorResponse = (apiError, res) => {
  res.status(apiError.status).json({
    error: apiError.message
  });
};

/**
 * @description This function is used to parse the error For Eg. Mongo Error
 * @param {*} err
 * @return {String} Error message
 */
const inspectDetail = err => {
  // native mongo driver errors, forwarded by mongoose
  if (err instanceof Error && err.name === "MongoError" && err.driver) {
    switch (err.code) {
      case 11000: // unique index conflict
        return "Document already exists.";
    }
  }

  // generic errors
  if (err instanceof Error && err.message) {
    return err.message;
  }

  // return default detail
  return "Unknown Error";
};
