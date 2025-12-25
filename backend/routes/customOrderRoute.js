const express = require('express');
const { createCustomOrder, listCustomOrders, userCustomOrders, updateStatus } = require('../controllers/customOrderController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');

const customOrderRouter = express.Router();

customOrderRouter.post('/create', upload.single('image'), authMiddleware, createCustomOrder);
customOrderRouter.post('/list', listCustomOrders); // Using POST to match general pattern if any (or GET) - sticking to GET for List usually but product is GET.
// However, admin panel might use a generic fetcher. I will use GET for list.
customOrderRouter.get('/list', listCustomOrders);
customOrderRouter.post('/userorders', authMiddleware, userCustomOrders);
customOrderRouter.post('/status', updateStatus); // Admin update

module.exports = customOrderRouter;
