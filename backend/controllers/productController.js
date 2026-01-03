const productModel = require("../models/Product");

// Function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, category, subCategory, sizes, sizePrices, defaultSize, colors, bestseller, shippingFee, productId } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        const image6 = req.files.image6 && req.files.image6[0];

        const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined);
        // Helper to get image URL (Cloudinary or Local)
        const getFileUrl = (item) => {
            if (item.path && (item.path.startsWith('http:') || item.path.startsWith('https:'))) {
                return item.path;
            }
            // Local fallback
            let protocol = req.protocol;
            if (req.get('host').includes('onrender.com')) {
                protocol = 'https';
            }
            return `${protocol}://${req.get('host')}/uploads/${item.filename}`;
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                return getFileUrl(item);
            })
        )

        const productData = {
            name,
            description,
            category,
            sizes: JSON.parse(sizes),
            sizePrices: sizePrices ? JSON.parse(sizePrices) : {},
            defaultSize: defaultSize || '',
            colors: colors ? JSON.parse(colors) : [],
            image: imagesUrl,
            date: Date.now(),
            shippingFee: shippingFee ? Number(shippingFee) : 100
        }

        if (productId && productId.trim() !== "") {
            productData._id = productId.trim();
        }

        const product = new productModel(productData);

        // Explicitly handle sizePrices for Mixed type reliability
        console.log("Backend Debug - STARTING SAVE");
        console.log("Backend Debug - Raw sizePrices from Body:", sizePrices);
        if (sizePrices) {
            const parsedSizePrices = JSON.parse(sizePrices);
            console.log("Backend Debug - Parsed sizePrices:", parsedSizePrices);
            product.sizePrices = parsedSizePrices;
            product.markModified('sizePrices');
        } else {
            console.log("Backend Debug - sizePrices is MISSING or UNDEFINED");
        }

        await product.save();

        console.log("VERSION: PRICE REMOVED - SAVED PRODUCT:", product);

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for list product
// const listProducts = async (req, res) => {
//     try {
//         const products = await productModel.find({});
//         res.json({ success: true, products: products });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ date: -1 }).lean();
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId).lean();
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for new arrivals
const listNewArrivals = async (req, res) => {
    try {
        // Fetch last 10 products sorted by date
        const products = await productModel.find({}).sort({ date: -1 }).limit(10).lean();
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for updating product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, category, subCategory, sizes, sizePrices, defaultSize, colors, bestseller, shippingFee } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        let updatedImages = [...product.image];

        const getUrl = (file) => {
            if (file.path && (file.path.startsWith('http:') || file.path.startsWith('https:'))) {
                return file.path;
            }
            let protocol = req.protocol;
            if (req.get('host').includes('onrender.com')) {
                protocol = 'https';
            }
            return `${protocol}://${req.get('host')}/uploads/${file.filename}`;
        }

        if (req.body.deletedIndices) {
            const deleted = JSON.parse(req.body.deletedIndices);
            deleted.forEach(index => {
                if (index >= 0 && index < updatedImages.length) {
                    updatedImages[index] = null;
                }
            });
        }

        if (req.files.image1) updatedImages[0] = getUrl(req.files.image1[0]);
        if (req.files.image2) updatedImages[1] = getUrl(req.files.image2[0]);
        if (req.files.image3) updatedImages[2] = getUrl(req.files.image3[0]);
        if (req.files.image4) updatedImages[3] = getUrl(req.files.image4[0]);
        if (req.files.image5) updatedImages[4] = getUrl(req.files.image5[0]);
        if (req.files.image6) updatedImages[5] = getUrl(req.files.image6[0]);

        updatedImages = updatedImages.filter(item => item);

        // Update fields
        product.name = name;
        product.description = description;
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === "true" ? true : false;
        product.sizes = JSON.parse(sizes);

        // Debug and Update sizePrices
        // console.log("Backend Debug - Incoming sizePrices (raw):", sizePrices);
        if (sizePrices) {
            const parsedSizePrices = JSON.parse(sizePrices);
            // console.log("Backend Debug - Parsed sizePrices:", parsedSizePrices);
            product.sizePrices = parsedSizePrices;
            product.markModified('sizePrices');
        }

        product.defaultSize = defaultSize || '';
        if (colors) product.colors = JSON.parse(colors);
        product.image = updatedImages;
        product.shippingFee = shippingFee ? Number(shippingFee) : 100;

        await product.save();
        res.json({ success: true, message: "Product Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for best sellers
const listBestSellers = async (req, res) => {
    try {
        const products = await productModel.find({ bestseller: true }).lean();
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add Product Review
const addProductReview = async (req, res) => {
    try {
        const { rating, comment, productId, orderId, purchaseDate } = req.body;
        // User is attached to req by auth middleware
        const userId = req.body.userId;
        const userModel = require('../models/User');
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const review = {
            userId: userId,
            orderId: orderId,
            purchaseDate: purchaseDate,
            userName: user.name,
            rating: Number(rating),
            comment: comment,
            date: Date.now()
        };

        // Check if user already reviewed THIS order
        // Uniquely identify by orderId (which implies distinct time/transaction)
        const alreadyReviewedIndex = product.reviews.findIndex(
            (r) => r.userId.toString() === userId.toString() && (r.orderId === orderId || (!r.orderId && !orderId))
        );

        if (alreadyReviewedIndex !== -1) {
            // Update existing review for this order
            product.reviews[alreadyReviewedIndex].rating = Number(rating);
            product.reviews[alreadyReviewedIndex].comment = comment;
            product.reviews[alreadyReviewedIndex].date = Date.now();
            product.reviews[alreadyReviewedIndex].purchaseDate = purchaseDate;

            // Fix missing orderId if updating
            if (!product.reviews[alreadyReviewedIndex].orderId && orderId) {
                product.reviews[alreadyReviewedIndex].orderId = orderId;
            }
        } else {
            // Add new review
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
        }

        // Calculate Average
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ success: true, message: "Review added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const mongoose = require('mongoose');

const getUserReviews = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.json({ success: false, reviews: [] });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const products = await productModel.find({ "reviews.userId": userObjectId });

        let userReviews = [];
        products.forEach(product => {
            product.reviews.forEach(review => {
                if (review.userId.toString() === userId.toString()) {
                    userReviews.push({
                        productId: product._id.toString(),
                        orderId: review.orderId ? review.orderId.toString() : "",
                        purchaseDate: review.purchaseDate,
                        rating: review.rating,
                        comment: review.comment,
                        date: review.date,
                        productName: product.name,
                        productImage: product.image && product.image.length > 0 ? product.image[0] : ""
                    });
                }
            })
        });

        res.json({ success: true, reviews: userReviews });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { listProducts, addProduct, removeProduct, singleProduct, listNewArrivals, updateProduct, listBestSellers, addProductReview, getUserReviews };
