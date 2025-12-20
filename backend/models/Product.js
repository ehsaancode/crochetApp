// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: Array, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String },
//     sizes: { type: Array, required: true },
//     bestseller: { type: Boolean },
//     date: { type: Number, required: true },
//     rating: { type: Number, default: 0 },
//     shippingFee: { type: Number, default: 100 }
// });

// const productModel = mongoose.models.product || mongoose.model("product", productSchema);

// module.exports = productModel;


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            index: true
        },

        image: {
            type: [String],
            required: true
        },

        category: {
            type: String,
            required: true,
            index: true
        },

        subCategory: {
            type: String,
            index: true
        },

        sizes: {
            type: [String],
            required: true
        },

        bestseller: {
            type: Boolean,
            default: false,
            index: true
        },

        rating: {
            type: Number,
            default: 0
        },

        shippingFee: {
            type: Number,
            default: 100
        },

        reviews: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                userName: String,
                rating: Number,
                comment: String,
                date: { type: Date, default: Date.now }
            }
        ],

        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true // createdAt, updatedAt
    }
);

// Indexes for performance
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ bestseller: 1 });

const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
