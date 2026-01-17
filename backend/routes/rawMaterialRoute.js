const express = require('express');
const { addRawMaterial, listRawMaterials, removeRawMaterial, singleRawMaterial, updateRawMaterial } = require('../controllers/rawMaterialController');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth'); // Assuming admin auth is needed

const rawMaterialRouter = express.Router();

rawMaterialRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addRawMaterial);
rawMaterialRouter.get('/list', listRawMaterials);
rawMaterialRouter.post('/update', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), updateRawMaterial);
rawMaterialRouter.post('/single', singleRawMaterial);
rawMaterialRouter.post('/remove', adminAuth, removeRawMaterial);

module.exports = rawMaterialRouter;
