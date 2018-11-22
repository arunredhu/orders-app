const createOrder = require("./create-order");
const listOrders = require("./list-orders");
const updateOrder = require("./update-order");

module.exports = {
  ...createOrder,
  ...listOrders,
  ...updateOrder
};
