const CustomOrder = require('../models/customOrderModel');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create a new Custom Order
const createCustomOrder = async (req, res) => {
    try {
        const { size, colorPreference, customColor, yarnType, description } = req.body;
        let userId = req.userId || req.body.userId;

        // Fallback: Manually decode token if middleware didn't pass userId correctly through multer
        if (!userId && req.headers.token) {
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) {
                console.log("Token decode failed in controller fallback:", e.message);
            }
        }

        console.log("Custom Order Request - Final UserId:", userId);

        if (!userId) {
            return res.json({ success: false, message: "User authentication failed. Please login again." });
        }

        console.log("Custom Order Request:");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        let imageUrl = '';

        if (req.file) {
            // Helper to get image URL
            const getFileUrl = (file) => {
                if (file.path && (file.path.startsWith('http:') || file.path.startsWith('https:'))) {
                    return file.path;
                }
                // Local fallback
                let protocol = req.protocol;
                if (req.get('host').includes('onrender.com')) {
                    protocol = 'https';
                }
                return `${protocol}://${req.get('host')}/uploads/${file.filename}`;
            }
            imageUrl = getFileUrl(req.file);
        } else {
            return res.json({ success: false, message: "Image is required" });
        }

        const customOrder = new CustomOrder({
            userId,
            image: imageUrl,
            size,
            colorPreference,
            customColor,
            yarnType,
            description,
            date: Date.now()
        });

        console.log("Saving new order:", customOrder);
        const savedOrder = await customOrder.save();
        console.log("Order saved successfully:", savedOrder._id);
        res.json({ success: true, message: "Custom Order Request Sent" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List all (Admin)
const listCustomOrders = async (req, res) => {
    try {
        console.log("Fetching custom orders list...");
        const orders = await CustomOrder.find({}).sort({ date: -1 }).populate('userId', 'name email phone address');
        console.log("Orders found:", orders.length);
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List user specific (Frontend - optional but good)
const userCustomOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await CustomOrder.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await CustomOrder.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { createCustomOrder, listCustomOrders, userCustomOrders, updateStatus };
