const express = require('express');
const { addImage, listImages, removeImage } = require('../controllers/galleryController');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');

const galleryRouter = express.Router();

galleryRouter.post('/add', adminAuth, upload.array('image'), addImage);
galleryRouter.post('/remove', adminAuth, removeImage);
galleryRouter.get('/list', listImages);

module.exports = galleryRouter;
