const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

// Connect to DB (using standard URI from .env or hardcoded for this quick check)
// Assuming local mongo or referencing the one in config
// I'll try to load from config logic, or just assume localhost/env
require('dotenv').config({ path: './backend/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://ehsaancode:Ehsaan123@cluster0.h1ue0.mongodb.net/e-commerce");
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const checkProducts = async () => {
    await connectDB();

    try {
        const products = await Product.find({}).sort({ updatedAt: -1 }).limit(3).lean();
        console.log("----- Checking Last 3 Products -----");
        products.forEach(p => {
            console.log(`ID: ${p._id}`);
            console.log(`Name: ${p.name}`);
            console.log(`Price: ${p.price}`);
            console.log(`Default Size: '${p.defaultSize}'`);
            console.log(`Size Prices:`, p.sizePrices);
            console.log(`Size Prices Type:`, typeof p.sizePrices);
            console.log("-----------------------------------");
        });
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkProducts();
