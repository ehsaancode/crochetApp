const userModel = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const orderModel = require('../models/Order');
const productModel = require('../models/Product');
const nodemailer = require('nodemailer');
const path = require('path');

const generateEmailTemplate = (userName, content) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
            <h2 style="margin: 0; color: #4a4a4a;">Aalaboo</h2>
        </div>
        <div style="padding: 30px 20px;">
            <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
            <div style="font-size: 16px; line-height: 1.6; color: #555;">
                ${content}
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #888;">Best regards,<br>The Aalaboo Team</p>
        </div>
        <div>
            <img src="cid:aalaboofooter" alt="Aalaboo" style="width: 100%; display: block; border: 0;" />
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
            &copy; ${new Date().getFullYear()} Aalaboo. All rights reserved.
        </div>
    </div>
    `;
};

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
            address: address || { street: '', city: '', state: '', zip: '', country: '', otherAddresses: [] },
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
        if (!user.address) user.address = { otherAddresses: [] };
        if (!user.address.otherAddresses) user.address.otherAddresses = [];

        user.address.otherAddresses.push(address);
        user.markModified('address');

        await user.save();
        res.json({ success: true, message: "Address added successfully", addresses: user.address.otherAddresses });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update existing address
const updateSecondaryAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { index } = req.body;
        let { address } = req.body;

        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        const user = await userModel.findById(userId);
        if (!user.address || !user.address.otherAddresses || !user.address.otherAddresses[index]) {
            return res.json({ success: false, message: "Address not found" });
        }

        user.address.otherAddresses[index] = address;
        user.markModified('address');
        await user.save();

        res.json({ success: true, message: "Address updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete secondary address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { index, type } = req.body;

        const user = await userModel.findById(userId);

        if (type === 'legacy') {
            if (!user.addresses || !user.addresses[index]) {
                return res.json({ success: false, message: "Address not found" });
            }
            user.addresses.splice(index, 1);
        } else {
            if (!user.address || !user.address.otherAddresses || !user.address.otherAddresses[index]) {
                return res.json({ success: false, message: "Address not found" });
            }
            user.address.otherAddresses.splice(index, 1);
        }

        user.markModified('address');
        user.markModified('addresses'); // Mark legacy array modified too if touched
        await user.save();

        res.json({ success: true, message: "Address deleted successfully" });

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
        console.log("DEBUG BODY:", JSON.stringify(req.body));

        const user = await userModel.findById(userId);

        if (!user) {
            console.log("DEBUG: User not found for ID:", userId);
            return res.json({ success: false, message: "User not found" });
        }

        // DEBUG: Detailed Request Info
        if (action === 'message' || action === 'accept') {
            console.log(`--- DEBUG REQUEST START ---`);
            console.log(`Action: ${action}`);
            console.log(`Target UserID from Body: ${userId}`);
            console.log(`Found User: ${user._id} (${user.email})`);
            console.log(`Target ProductID: ${productId} (Type: ${typeof productId})`);
            console.log(`User Wishlist Length: ${user.wishlist.length}`);
            console.log(`User Wishlist Dump:`, JSON.stringify(user.wishlist));
            console.log(`SMTP Configured: ${process.env.SMTP_PASSWORD ? 'YES' : 'NO'}`);
            console.log(`--- DEBUG REQUEST END ---`);
        }

        if (action === 'message') {
            const itemIndex = user.wishlist.findIndex(item => String(item.productId) === String(productId));
            let dbUpdated = false;

            if (itemIndex > -1) {
                user.wishlist[itemIndex].adminMessage = message;
                user.wishlist[itemIndex].requestStatus = 'message_received';
                user.markModified('wishlist');
                dbUpdated = true;
            }

            await user.save();

            // Send Email Notification
            const targetEmail = req.body.userEmail || user.email;
            const targetName = req.body.userName || user.name;
            console.log("DEBUG EMAIL (MESSAGE): Sending to:", targetEmail, "Name:", targetName);

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'mail.aalaboo@gmail.com',
                        pass: process.env.SMTP_PASSWORD
                    }
                });

                const emailHtml = generateEmailTemplate(targetName, `Message regarding your request:<br><br><i>"${message}"</i>`);
                await transporter.sendMail({
                    from: 'mail.aalaboo@gmail.com',
                    to: targetEmail,
                    subject: 'Message regarding your Product Request - Aalaboo',
                    text: `Hello ${targetName},\n\nAdmin Message regarding your request:\n\n"${message}"\n\nBest regards,\nAalaboo Team`,
                    html: emailHtml,
                    attachments: [{
                        filename: 'footer.png',
                        path: path.join(process.cwd(), 'assets/footer.png'),
                        cid: 'aalaboofooter'
                    }]
                });
            } catch (e) {
                console.log("Email send failed:", e);
            }

            res.json({ success: true, message: dbUpdated ? "Message sent to user (DB Updated)" : "Message sent via Email only (Item not in wishlist)" });

        } else if (action === 'accept') {
            const itemIndex = user.wishlist.findIndex(item => String(item.productId) === String(productId));

            let product = null;
            try {
                product = await productModel.findById(productId);
            } catch (e) { console.log("Product fetch error:", e); }

            const sizeToAdd = product ? (product.defaultSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size')) : 'One Size';

            let cartData = user.cartData || {};
            if (!cartData[productId]) { cartData[productId] = {}; }
            if (cartData[productId][sizeToAdd]) { cartData[productId][sizeToAdd] += 1; } else { cartData[productId][sizeToAdd] = 1; }
            user.cartData = cartData;
            user.markModified('cartData');

            if (itemIndex > -1) {
                user.wishlist[itemIndex].requestStatus = 'accepted';
                user.wishlist[itemIndex].adminMessage = `Request Accepted! Added to your Cart (${sizeToAdd}).`;
                user.markModified('wishlist');
            }

            await user.save();

            const targetEmail = req.body.userEmail || user.email;
            const targetName = req.body.userName || user.name;
            console.log("DEBUG EMAIL (ACCEPT): Sending to:", targetEmail, "Name:", targetName);

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: 'mail.aalaboo@gmail.com', pass: process.env.SMTP_PASSWORD }
                });

                const emailHtml = generateEmailTemplate(targetName, `Good news! The product you requested has been restocked and added to your Cart.<br><br>Please login to check out.`);
                await transporter.sendMail({
                    from: 'mail.aalaboo@gmail.com',
                    to: targetEmail,
                    subject: 'Product Request Accepted - Aalaboo',
                    text: `Hello ${targetName},\n\nGood news! The product you requested has been restocked and added to your Cart.\n\nPlease login to check out.\n\nBest regards,\nAalaboo Team`,
                    html: emailHtml,
                    attachments: [{
                        filename: 'footer.png',
                        path: path.join(process.cwd(), 'assets/footer.png'),
                        cid: 'aalaboofooter'
                    }]
                });
            } catch (e) { console.log("Email send failed:", e); }

            res.json({ success: true, message: "Request accepted (Cart updated & Email sent)" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const contactFormEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: 'mail.aalaboo@gmail.com', pass: process.env.SMTP_PASSWORD }
        });

        const emailHtml = generateEmailTemplate("Admin",
            `New Contact Form Inquiry<br><br>
            <b>Name:</b> ${name}<br>
            <b>Email:</b> ${email}<br>
            <b>Message:</b><br>${message.replace(/\n/g, '<br>')}`
        );

        await transporter.sendMail({
            from: 'mail.aalaboo@gmail.com',
            to: 'mail.aalaboo@gmail.com',
            replyTo: email,
            subject: `New Inquiry from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
            html: emailHtml,
            attachments: [{
                filename: 'footer.png',
                path: path.join(process.cwd(), 'assets/footer.png'),
                cid: 'aalaboofooter'
            }]
        });

        res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { loginUser, registerUser, adminLogin, getProfile, updateProfile, allUsers, addToWishlist, removeFromWishlist, requestProduct, getAllRequests, handleRequest, addAddress, updateSecondaryAddress, deleteAddress, contactFormEmail };
