const userModel = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const orderModel = require('../models/Order');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        let { address } = req.body;

        // Handle address if sent as string (FormData)
        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                console.log("Error parsing address:", e);
                // Fallback or leave as is if it's not JSON
            }
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = req.file.path;
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address: address || { street: '', city: '', state: '', zip: '', country: '' },
            image: imageUrl
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.json({ success: false, message: "Not authorized as Admin" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for getting user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await userModel.findById(userId).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for updating user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { name, phone } = req.body;
        let { address } = req.body;

        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) { console.log(e) }
        }

        const updateData = { name, phone, address };

        if (req.file) {
            updateData.image = req.file.path;
        }

        await userModel.findByIdAndUpdate(userId, updateData);

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add new address
const addAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        let { address } = req.body;

        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        const user = await userModel.findById(userId);
        let addresses = user.addresses || [];
        addresses.push(address);

        await userModel.findByIdAndUpdate(userId, { addresses });
        res.json({ success: true, message: "Address added successfully", addresses });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for getting all users (Admin)
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, product } = req.body;

        const user = await userModel.findById(userId);
        let wishlist = user.wishlist || [];

        const exists = wishlist.some(item => item.productId === product._id);
        if (exists) {
            return res.json({ success: false, message: "Item already in wishlist" });
        }

        wishlist.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            addedAt: new Date()
        });

        await userModel.findByIdAndUpdate(userId, { wishlist });
        res.json({ success: true, message: "Added to wishlist" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await userModel.findById(userId);
        let wishlist = user.wishlist || [];

        wishlist = wishlist.filter(item => item.productId !== productId);

        await userModel.findByIdAndUpdate(userId, { wishlist });
        res.json({ success: true, message: "Removed from wishlist" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Request Product
const requestProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);

        const updatedWishlist = user.wishlist.map(item => {
            if (item.productId === productId) {
                return { ...item, requestStatus: 'pending', requestedAt: new Date() };
            }
            return item;
        });

        await userModel.findByIdAndUpdate(userId, { wishlist: updatedWishlist });
        res.json({ success: true, message: "Request sent successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get All Requests (Admin)
const getAllRequests = async (req, res) => {
    try {
        const requests = await userModel.aggregate([
            { $unwind: "$wishlist" },
            { $match: { "wishlist.requestStatus": { $in: ["pending", "message_received"] } } },
            {
                $addFields: {
                    productIdObjectId: {
                        $convert: {
                            input: "$wishlist.productId",
                            to: "objectId",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productIdObjectId",
                    foreignField: "_id",
                    as: "liveProduct"
                }
            },
            {
                $project: {
                    userId: "$_id",
                    userName: "$name",
                    userEmail: "$email",
                    product: "$wishlist",
                    isAvailable: { $gt: [{ $size: "$liveProduct" }, 0] }
                }
            }
        ]);
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Handle Request (Admin)
const handleRequest = async (req, res) => {
    try {
        const { userId, productId, action, message } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (action === 'message') {
            const itemIndex = user.wishlist.findIndex(item => String(item.productId) === String(productId));
            if (itemIndex > -1) {
                user.wishlist[itemIndex].adminMessage = message;
                user.wishlist[itemIndex].requestStatus = 'message_received';
                user.markModified('wishlist');
                await user.save();
                res.json({ success: true, message: "Message sent to user" });
            } else {
                const dump = user.wishlist.map(i => i.productId ? `${i.productId}` : 'NO_ID').join(', ');
                res.json({ success: false, message: `Item not found. Target: ${productId}. Length: ${user.wishlist.length}. Available: ${dump}` });
            }
        } else if (action === 'accept') {
            // Create Order
            const wishlistItem = user.wishlist.find(item => String(item.productId) === String(productId));
            if (!wishlistItem) {
                const dump = user.wishlist.map(i => i.productId ? `${i.productId}` : 'NO_ID').join(', ');
                return res.json({ success: false, message: `Item not found (Accept). Target: ${productId}. Length: ${user.wishlist.length}. Available: ${dump}` });
            }

            const newOrder = new orderModel({
                userId,
                items: [wishlistItem], // Using snapshot
                amount: wishlistItem.price,
                address: user.address || {},
                status: 'Order Placed',
                paymentMethod: 'Request/COD',
                payment: false,
                date: Date.now()
            });
            await newOrder.save();

            // Update wishlist
            const itemIndex = user.wishlist.findIndex(item => String(item.productId) === String(productId));
            if (itemIndex > -1) {
                user.wishlist[itemIndex].requestStatus = 'accepted';
                user.wishlist[itemIndex].adminMessage = 'Order Request Accepted!';
                user.markModified('wishlist');
                await user.save();
            }
            res.json({ success: true, message: "Request accepted and order created" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { loginUser, registerUser, adminLogin, getProfile, updateProfile, allUsers, addToWishlist, removeFromWishlist, requestProduct, getAllRequests, handleRequest, addAddress };
