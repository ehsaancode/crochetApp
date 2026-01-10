const mongoose = require('mongoose');

const sellerRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    shopName: { type: String },
    experience: { type: String },
    bio: { type: String },
    portfolioImages: { type: Array, default: [] }, // Array of image URLs
    portfolioVideos: { type: Array, default: [] }, // Array of video URLs
    socialLinks: { type: Object, default: {} },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    date: { type: Number, default: Date.now }
});

const sellerRequestModel = mongoose.models.sellerRequest || mongoose.model('sellerRequest', sellerRequestSchema);

module.exports = sellerRequestModel;
