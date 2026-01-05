
const mongoose = require('mongoose');
const Order = require('./backend/models/Order');
require('dotenv').config({ path: './backend/.env' });

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders.`);

        if (orders.length > 0) {
            orders.slice(0, 5).forEach(order => {
                console.log(`Order ID: ${order._id}`);
                console.log(`  Date: ${order.date} (${new Date(order.date).toLocaleString()})`);
                console.log(`  StatusDate: ${order.statusDate} (${new Date(order.statusDate).toLocaleString()})`);
                console.log(`  Items Count: ${order.items.length}`);
                console.log("---");
            });
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkOrders();
