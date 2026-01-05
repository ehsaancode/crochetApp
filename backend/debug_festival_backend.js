
const mongoose = require('mongoose');
const Festival = require('./models/Festival');
require('dotenv').config();

const checkFestival = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const festival = await Festival.findOne();
        console.log("Festival Config in DB:");
        console.log(JSON.stringify(festival, null, 2));

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkFestival();
