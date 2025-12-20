const express = require('express');
const { listProducts, addProduct, removeProduct, singleProduct, listNewArrivals, updateProduct, listBestSellers, addProductReview } = require('../controllers/productController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');

const productRouter = express.Router();

productRouter.post('/add', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }]), addProduct);
productRouter.post('/update', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }]), updateProduct);
productRouter.post('/remove', removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/new-arrivals', listNewArrivals);
productRouter.get('/bestsellers', listBestSellers);
productRouter.post('/review', authMiddleware, addProductReview);

module.exports = productRouter;
