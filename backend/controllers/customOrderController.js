const CustomOrder = require('../models/customOrderModel');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create a new Custom Order
const createCustomOrder = async (req, res) => {
    try {
        console.log("--- createCustomOrder START ---");
        const { size, colorPreference, customColor, yarnType, description } = req.body;
        let userId = req.userId || req.body.userId;

        console.log("Initial - req.body:", req.body);
        console.log("Initial - req.files:", req.files);
        console.log("Initial - userId from Auth Middleware:", req.userId);

        // Fallback: Manually decode token if middleware didn't pass userId correctly through multer
        if (!userId && req.headers.token) {
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
                userId = decoded.id;
                console.log("UserId recovered from manual token decode:", userId);
            } catch (e) {
                console.log("Token decode failed in controller fallback:", e.message);
            }
        }

        console.log("Final UserId:", userId);

        if (!userId) {
            console.log("ERROR: User authentication failed - No UserId");
            return res.json({ success: false, message: "User authentication failed. Please login again." });
        }

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => {
                if (file.path && (file.path.startsWith('http:') || file.path.startsWith('https:'))) {
                    return file.path;
                }
                // Local fallback
                let protocol = req.protocol;
                if (req.get('host').includes('onrender.com')) protocol = 'https';
                return `${protocol}://${req.get('host')}/uploads/${file.filename}`;
            });
            console.log("Generated Image URLs:", imageUrls);
        } else {
            console.log("ERROR: No files uploaded");
            return res.json({ success: false, message: "At least one image is required" });
        }

        const customOrder = new CustomOrder({
            userId,
            image: imageUrls,
            size,
            colorPreference,
            customColor,
            yarnType,
            description,
            date: Date.now()
        });

        console.log("CustomOrder Instance created:", customOrder);

        // Update User Address if provided (Address snapshot logic)
        const { street, city, state, zip, country, phone, landmark } = req.body;
        if (street && city && state && zip && country) {
            try {
                // Only update if User found
                await User.findByIdAndUpdate(userId, {
                    address: { street, city, state, zip, country, landmark },
                    phone: phone || undefined
                });
                console.log("User address updated from custom order");
            } catch (err) {
                console.log("Failed to update user address:", err);
            }
        }

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
