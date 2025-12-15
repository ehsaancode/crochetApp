const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
require('dotenv').config();

// Check if Cloudinary credentials exist
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinary) {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Configure Cloudinary Storage
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'crochet_app',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });
    console.log("Multer configured with Cloudinary storage.");
} else {
    // Fallback to Local Storage
    console.warn("WARNING: Cloudinary credentials missing in .env. Falling back to Local Disk Storage.");

    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, uploadDir);
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
}

const upload = multer({ storage });

module.exports = upload;
