const { validate } = require("jsonschema");

const { APIError } = require("../../shared/utils");

const { ordersService } = require("../services");

// request schema for list orders
const reqSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    limit: {
      type: ["integer", "string"],
      pattern: "^\\d+$"
    },
    page: {
      type: ["integer", "string"],
      pattern: "^\\d+$"
    }
  },
  required: ["limit", "page"]
};

/**
 * @description Validate the list orders request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateListOrdersRequest = (req, res, next) => {
  const { valid } = validate(req.query, reqSchema);

  if (!valid) {
    throw new APIError("INVALID_PARAMETERS", 400);
  }

  const { page, limit } = req.query;

  // page and limit shoud be greater than zero
  if (page <= 0 || limit <= 0) {
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
const listOrders = async (req, res, next) => {
  const { page, limit } = req.query;

  const results = await ordersService.listOrders(page, limit).catch(e => {
    next(e);
  });

  if (results) {
    const { docs } = results;

    const orders = docs.map(({ id, status, distance }) => ({
      id,
      status,
      distance
    }));

    res.send(orders);
  }
};

module.exports = {
  validateListOrdersRequest,
  listOrders
};
