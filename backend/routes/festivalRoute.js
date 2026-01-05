const express = require('express');
const { getFestival, updateFestival } = require('../controllers/festivalController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/auth'); // Admin auth ideally

const festivalRouter = express.Router();

festivalRouter.get('/get', getFestival);
festivalRouter.post('/update', upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), updateFestival);

module.exports = festivalRouter;
