const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    colorPreference: { type: String, required: true },
    customColor: { type: String },
    yarnType: { type: String },
    description: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Number, default: Date.now }
});

const CustomOrder = mongoose.models.customOrder || mongoose.model('customOrder', customOrderSchema);

module.exports = CustomOrder;
