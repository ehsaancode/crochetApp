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
            await orderModel.findByIdAndUpdate(orderInfo._id, { payment: true, paymentId: razorpay_payment_id });
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

// Calculate Delivery Fee Server-Side (Avoids CORS)
const calculateDelivery = async (req, res) => {
    try {
        const { street, city, state, zipcode, country } = req.body;

        if (!street || !city || !zipcode) {
            return res.json({ success: false, message: "Missing address details" });
        }

        const query = `${street}, ${city}, ${state}, ${zipcode}, ${country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        // Use built-in fetch with User-Agent
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Aalaboo-Backend/1.0' // Required by Nominatim
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];

            // Warehouse Coords (Puinan)
            const WAREHOUSE_LAT = 22.944245420133758;
            const WAREHOUSE_LON = 88.28156250538409;

            // Distance Calculation (Haversine Formula)
            const R = 6371; // Radius of earth in km
            const dLat = (lat - WAREHOUSE_LAT) * Math.PI / 180;
            const dLon = (lon - WAREHOUSE_LON) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(WAREHOUSE_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distance in km

            let fee = 0;
            if (distance > 150) {
                fee = 150;
            } else if (distance > 40) {
                fee = 100;
            }

            return res.json({ success: true, fee, distance });
        } else {
            return res.json({ success: false, message: "Address not found" });
        }

    } catch (error) {
        console.log("Delivery Calc Error:", error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { placeOrder, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus, cancelOrder, calculateDelivery };
