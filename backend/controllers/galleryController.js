const galleryModel = require("../models/galleryModel");
const cloudinary = require('cloudinary').v2;

const addImage = async (req, res) => {
    try {
        const imageFiles = req.files;

        if (!imageFiles || imageFiles.length === 0) {
            return res.json({ success: false, message: "No images uploaded" })
        }

        const uploadPromises = imageFiles.map(async (file) => {
            let imageUrl = file.path;

            // Handle local file path if not a URL (i.e. if falling back to local storage)
            if (!imageUrl.startsWith('http')) {
                let protocol = req.protocol;
                if (req.get('host').includes('onrender.com')) {
                    protocol = 'https';
                }
                imageUrl = `${protocol}://${req.get('host')}/uploads/${file.filename}`;
            }

            return new galleryModel({
                image: imageUrl,
                date: Date.now()
            }).save();
        });

        await Promise.all(uploadPromises);

        res.json({ success: true, message: "Images Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const listImages = async (req, res) => {
    try {
        const images = await galleryModel.find({});
        res.json({ success: true, images })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const removeImage = async (req, res) => {
    try {
        await galleryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Image Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

module.exports = { addImage, listImages, removeImage }
