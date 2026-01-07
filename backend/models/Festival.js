const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: false },
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    backgroundColor: { type: String, default: '#ffffff' }, // Hex color
    backgroundImage: { type: String, default: '' }, // URL
    heroImage: { type: String, default: '' }, // URL (Main decorative image)
    heroWidth: { type: String, default: '12rem' }, // CSS value
    heroWidthDesktop: { type: String, default: '24rem' }, // CSS value for desktop
    fontColor: { type: String, default: '' }, // Optional overriding font color
    blurBackground: { type: Boolean, default: false },
    productCardColor: { type: String, default: '' }, // Optional overriding product card color
    productIds: [{ type: String }], // Array of product IDs to show
    lastUpdated: { type: Date, default: Date.now }
});

const festivalModel = mongoose.models.festival || mongoose.model("festival", festivalSchema);

module.exports = festivalModel;
