const productModel = require("../models/Product");

// Function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, shippingFee, productId } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
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
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
            shippingFee: shippingFee ? Number(shippingFee) : 100
        }

        if (productId && productId.trim() !== "") {
            productData._id = productId.trim();
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

// Function for updating product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, sizes, bestseller, shippingFee } = req.body;

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

        // Handle image updates by index
        if (req.files.image1) updatedImages[0] = getUrl(req.files.image1[0]);
        if (req.files.image2) updatedImages[1] = getUrl(req.files.image2[0]);
        if (req.files.image3) updatedImages[2] = getUrl(req.files.image3[0]);
        if (req.files.image4) updatedImages[3] = getUrl(req.files.image4[0]);

        // Filter out any potential gaps if the original array was shorter and we added to a later index, 
        // though typically we want to preserve order. 
        // If we strictly map 1->0, 2->1, 3->2, 4->3, gaps might appear if 3 is missing but 4 added.
        // Let's filter undefined/nulls to be safe, assuming we want a compact list.
        updatedImages = updatedImages.filter(item => item);

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: updatedImages,
            shippingFee: shippingFee ? Number(shippingFee) : 100
        };

        await productModel.findByIdAndUpdate(productId, updateData);
        res.json({ success: true, message: "Product Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { listProducts, addProduct, removeProduct, singleProduct, listNewArrivals, updateProduct };
