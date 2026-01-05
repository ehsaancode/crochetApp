
const mongoose = require('mongoose');
const Festival = require('./models/Festival');
require('dotenv').config();

const checkFestival = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const festival = await Festival.findOne();
        if (festival) {
            console.log("IS_ACTIVE: " + festival.isActive);
            console.log("PRODUCT_IDS: " + festival.productIds);
        } else {
            console.log("NO_FESTIVAL_FOUND");
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkFestival();
