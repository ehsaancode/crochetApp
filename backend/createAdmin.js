const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const userModel = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected for Admin Creation");

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.log("Error: ADMIN_EMAIL or ADMIN_PASSWORD not found in .env file.");
            process.exit(1);
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            console.log(`User ${email} already exists.`);
            if (existingUser.role === 'admin') {
                console.log("User is already an Admin.");
            } else {
                console.log("Updating role to 'admin'...");
                existingUser.role = 'admin';
                await existingUser.save();
                console.log("Success: User updated to Admin.");
            }
        } else {
            console.log(`Creating new Admin user: ${email}`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = new userModel({
                name: "Admin User",
                email: email,
                password: hashedPassword,
                role: 'admin'
            });

            await newAdmin.save();
            console.log("Success: Admin user created.");
        }

        console.log("You can now login to the Admin Panel.");
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
