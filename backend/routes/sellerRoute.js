const express = require('express');
const { registerSeller, listRequests } = require('../controllers/sellerController');
const upload = require('../middleware/multer');

const sellerRouter = express.Router();

sellerRouter.post('/register', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 2 }]), registerSeller);
sellerRouter.get('/list', listRequests);

module.exports = sellerRouter;
