const orderModel = require("../models/Order");
const userModel = require("../models/User");

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status, statusDate: Date.now() });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Check if order status is 'Order Placed' (only allow cancel if not processed yet)
        if (order.status !== 'Order Placed') {
            return res.json({ success: false, message: "Order cannot be cancelled at this stage" });
        }

        // Check time limit (5 hours)
        const fiveHours = 5 * 60 * 60 * 1000;
        if (Date.now() - order.date > fiveHours) {
            return res.json({ success: false, message: "Cancellation period (5 hours) has expired" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled', statusDate: Date.now(), cancelledBy: 'User' });
        res.json({ success: true, message: "Order Cancelled" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { placeOrder, allOrders, userOrders, updateStatus, cancelOrder };
