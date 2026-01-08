const festivalModel = require('../models/Festival');
const productModel = require('../models/Product');

// Get the current festival config
const getFestival = async (req, res) => {
    try {
        // Find the most recently updated or just the first one. We'll maintain just one for simplicity.
        let festival = await festivalModel.findOne();
        if (!festival) {
            // Create default if none exists
            festival = new festivalModel({
                name: "New Festival",
                isActive: false
            });
            await festival.save();
        }
        res.json({ success: true, festival });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update festival config
const updateFestival = async (req, res) => {
    try {
        let { name, subtitle, backgroundColor, productIds, isActive, heroWidth, heroWidthDesktop, fontColor, blurBackground, productCardColor, heroTop, heroRight } = req.body;

        let festival = await festivalModel.findOne();
        if (!festival) {
            festival = new festivalModel({});
        }

        festival.name = name;
        festival.subtitle = subtitle;
        festival.backgroundColor = backgroundColor;
        festival.isActive = isActive === 'true' || isActive === true;
        if (heroWidth) festival.heroWidth = heroWidth;
        if (heroWidthDesktop) festival.heroWidthDesktop = heroWidthDesktop;

        // Add missing fields
        festival.fontColor = fontColor || "";
        festival.blurBackground = blurBackground === 'true' || blurBackground === true;
        festival.productCardColor = productCardColor || "";
        festival.heroTop = heroTop || "-2.5rem";
        festival.heroRight = heroRight || "-1.5rem";

        if (productIds) {
            festival.productIds = JSON.parse(productIds);
        }

        // Handle Image Uploads
        const getUrl = (file) => {
            // If using Cloudinary or other remote storage, path is the full URL
            if (file.path && file.path.startsWith('http')) {
                return file.path;
            }

            // Fallback for local storage
            let protocol = req.protocol;
            if (req.get('host').includes('onrender.com')) {
                protocol = 'https';
            }
            return `${protocol}://${req.get('host')}/uploads/${file.filename}`;
        }

        if (req.files) {
            if (req.files.heroImage && req.files.heroImage[0]) {
                festival.heroImage = getUrl(req.files.heroImage[0]);
            }
            if (req.files.backgroundImage && req.files.backgroundImage[0]) {
                festival.backgroundImage = getUrl(req.files.backgroundImage[0]);
            }
        }

        festival.lastUpdated = Date.now();
        await festival.save();

        res.json({ success: true, message: "Festival Updated", festival });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { getFestival, updateFestival };
