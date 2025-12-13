const productModel = require("../models/Product");

// Function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                // Return relative path or full URL
                // For local: return `${req.protocol}://${req.get('host')}/uploads/${item.filename}`;
                return `http://localhost:5000/uploads/${item.filename}`;
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

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
        const product = await productModel.findById(productId);
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
        const products = await productModel.find({}).sort({ date: -1 }).limit(10);
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { listProducts, addProduct, removeProduct, singleProduct, listNewArrivals };
