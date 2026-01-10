const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    image: { type: String, required: true },
    date: { type: Number, required: true }
})

const galleryModel = mongoose.models.gallery || mongoose.model("gallery", gallerySchema);

module.exports = galleryModel;
