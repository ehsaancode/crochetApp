const sellerRequestModel = require('../models/sellerRequestModel');

const registerSeller = async (req, res) => {
    try {
        const { name, email, phone, shopName, experience, bio, socialLinks } = req.body;

        // Check if email already exists in pending requests? Maybe not strict but good to know.
        // For now, allow multiple requests or just store it.

        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const videos = req.files['videos'] ? req.files['videos'].map(file => file.path) : [];

        // Handle local file paths if necessary (fallback logic similar to galleryController)
        const processPath = (path, req) => {
            if (!path.startsWith('http')) {
                let protocol = req.protocol;
                if (req.get('host').includes('onrender.com')) {
                    protocol = 'https';
                }
                return `${protocol}://${req.get('host')}/uploads/${path.split('\\').pop().split('/').pop()}`;
            }
            return path;
        }

        const processedImages = images.map(path => processPath(path, req));
        const processedVideos = videos.map(path => processPath(path, req));


        const newRequest = new sellerRequestModel({
            name,
            email,
            phone,
            shopName,
            experience,
            bio,
            portfolioImages: processedImages,
            portfolioVideos: processedVideos,
            socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
            date: Date.now()
        });

        await newRequest.save();
        res.json({ success: true, message: "Seller request submitted successfully! We will contact you soon." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List all seller requests
const listRequests = async (req, res) => {
    try {
        const requests = await sellerRequestModel.find({}).sort({ date: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { registerSeller, listRequests };
