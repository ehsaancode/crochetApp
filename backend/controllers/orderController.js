const orderModel = require("../models/Order");
const userModel = require("../models/User");
const Razorpay = require('razorpay');

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
            date: Date.now(),
            statusDate: Date.now()
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

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
            statusDate: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay Keys Missing in Backend Environment Variables");
            return res.json({ success: false, message: "Server Error: Razorpay keys not configured" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: newOrder._id.toString()
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const orderInfo = await orderModel.findById(req.body.receipt); // receipt is orderId passed from frontend

        if (orderInfo) {
            await orderModel.findByIdAndUpdate(orderInfo._id, { payment: true });
            await userModel.findByIdAndUpdate(orderInfo.userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }

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
        console.log(`Order ${req.body.orderId} status updated to ${req.body.status} at ${new Date().toISOString()}`);
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

module.exports = { placeOrder, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus, cancelOrder };
