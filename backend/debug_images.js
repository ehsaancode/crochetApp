
const mongoose = require('mongoose');
const Festival = require('./models/Festival');
require('dotenv').config();

const checkFestivalImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const festival = await Festival.findOne();
        if (festival) {
            console.log("HERO_IMAGE: " + festival.heroImage);
            console.log("BG_IMAGE: " + festival.backgroundImage);
        } else {
            console.log("NO_FESTIVAL_FOUND");
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkFestivalImages();
