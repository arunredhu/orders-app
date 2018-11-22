const { validate } = require("jsonschema");

const { APIError } = require("../../shared/utils");

const { ordersService } = require("../services");

// request schema for create order
const reqSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    origin: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "string",
        minLength: 1
      }
    },
    destination: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "string",
        minLength: 1
      }
    }
  },
  required: ["origin", "destination"]
};

/**
 * @description Validate the create order request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateCreateOrderRequest = (req, res, next) => {
  const { valid } = validate(req.body, reqSchema);

  if (!valid) {
    throw new APIError("INVALID_PARAMETERS", 400);
  }

  next();
};

/**
 * @description Handle the route for creating the new order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createOrder = async (req, res, next) => {
  const { origin, destination } = req.body;

  const result = await ordersService
    .createOrder(origin, destination)
    .catch(e => {
      next(e);
    });

  if (result) {
    console.log(JSON.stringify(result));
    const { id, distance, status } = result;
    res.send({
      id,
      distance,
      status
    });
  }
};

module.exports = {
  validateCreateOrderRequest,
  createOrder
};
