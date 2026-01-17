const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: [String], required: true },
        color: { type: String, required: true },
        type: { type: String, required: true }, // e.g. Yarn, Hook, Button
        length: { type: String, required: false }, // Optional
    },
    { timestamps: true }
);

const RawMaterial = mongoose.models.RawMaterial || mongoose.model("RawMaterial", rawMaterialSchema);

module.exports = RawMaterial;
