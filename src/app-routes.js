const { Router } = require('express');

const { orderRoutes } = require('./orders');

const router = Router();

// adding the order routes
router.use(orderRoutes);

module.exports = router;
