const express = require('express');
const { placeOrder, allOrders, userOrders, updateStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', allOrders); // Ideally should be admin protected, adding auth later if needed or via admin-only token check
orderRouter.post('/status', updateStatus); // Ideally should be admin protected

// Payment Features
orderRouter.post('/place', authMiddleware, placeOrder);

// User Features
orderRouter.post('/userorders', authMiddleware, userOrders);

module.exports = orderRouter;
