const express = require('express');
const { listProducts, addProduct, removeProduct, singleProduct, listNewArrivals } = require('../controllers/productController');

const upload = require('../middleware/multer');

const productRouter = express.Router();

productRouter.post('/add', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/remove', removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/new-arrivals', listNewArrivals);

module.exports = productRouter;
