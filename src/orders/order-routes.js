const { Router } = require("express");

const {
  createOrder,
  validateCreateOrderRequest,
  listOrders,
  validateListOrdersRequest,
  updateOrder,
  validateUpdateOrderRequest
} = require("./controllers");

const router = Router();

// Route for order list
router.get("/orders", validateListOrdersRequest, listOrders);

// Route for updating the order status
router.patch("/orders/:id", validateUpdateOrderRequest, updateOrder);

// route for creating the new order
router.post("/orders", validateCreateOrderRequest, createOrder);

module.exports = router;
