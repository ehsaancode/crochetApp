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
    heroTop: { type: String, default: '-2.5rem' }, // -top-10 approx
    heroRight: { type: String, default: '-1.5rem' }, // -right-6 approx
    heroRight: { type: String, default: '-1.5rem' }, // -right-6 approx
    fontColor: { type: String, default: '' }, // Optional overriding font color
    blurBackground: { type: Boolean, default: false },
    showButton: { type: Boolean, default: true }, // Toggle for Explore Collection button
    productCardColor: { type: String, default: '' }, // Optional overriding product card color
    productIds: [{ type: String }], // Array of product IDs to show
    paraColor: { type: String, default: '' }, // Specific color for paragraph text
    headingFont: { type: String, default: '' }, // Font class for heading (e.g., font-serif, font-sans)
    lastUpdated: { type: Date, default: Date.now }
});

const festivalModel = mongoose.models.festival || mongoose.model("festival", festivalSchema);

module.exports = festivalModel;
