const { validate } = require("jsonschema");

const { APIError } = require("../../shared/utils");
const { ordersService } = require("../services");
const { orderStatus } = require("../config");

// request schema for update order
const reqSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      enum: [orderStatus.TAKEN]
    }
  },
  required: ["status"]
};

/**
 * @description Validate the update order request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateUpdateOrderRequest = (req, res, next) => {
  const { valid } = validate(req.body, reqSchema);

  if (!valid) {
    throw new APIError("INVALID_PARAMETERS", 400);
  }

  next();
};

/**
 * @description Handle the route for listing the order based on the filter specified
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateOrder = async (req, res, next) => {
  // getting the request data
  const { id } = req.params;
  const { status } = req.body;

  // service return the updated document
  const result = await ordersService
    .updateOrderStatus(id, orderStatus.UNASSIGNED, status)
    .catch(e => {
      next(e);
    });

  if (result) {
    res.send({ status: "SUCCESS" });
  }
};

module.exports = {
  validateUpdateOrderRequest,
  updateOrder
};
