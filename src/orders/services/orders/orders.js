const { APIError } = require("../../../shared/utils");
const distanceService = require("../distance/distance");
const { orderStatus } = require("../../config");
const { Order } = require("../../models");

/**
 * @description Create the new order
 * @param {*} origin
 * @param {*} destination
 */
const createOrder = async (origin, destination) => {
  const result = await distanceService.calcDistance(origin, destination);

  const order = {
    distance: result.value,
    status: orderStatus.UNASSIGNED,
    origin,
    destination
  };

  return await Order.create(order);
};

/**
 * @description Update the order status
 * @param {*} orderId
 * @param {*} status
 */
const updateOrderStatus = async (orderId, currentStatus, updatedStatus) => {
  const query = { _id: orderId, status: currentStatus };
  const updateValue = { status: updatedStatus };

  const updatedDoc = await Order.findOneAndUpdate(query, updateValue, {
    new: true
  });

  // Throw the error in case query doen't match with any document
  if (!updatedDoc) {
    throw new APIError("Order not available for update", 409);
  }

  return updatedDoc;
};

/**
 * @description returns the orders based on pagination
 * @param {*} page
 * @param {*} limit
 */
const listOrders = async (page, limit) => {
  page = Number(page);
  limit = Number(limit);

  const options = {
    select: "distance status id",
    sort: { _id: -1 },
    page,
    lean: true,
    limit
  };

  return Order.paginate({}, options);
};

module.exports = {
  createOrder,
  updateOrderStatus,
  listOrders
};
