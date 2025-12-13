const express = require('express');
const { loginUser, registerUser, adminLogin, getProfile, updateProfile, allUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');
const userRouter = express.Router();

userRouter.post('/register', upload.single('image'), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.post('/update-profile', authMiddleware, upload.single('image'), updateProfile);
userRouter.post('/all-users', allUsers);

module.exports = userRouter;
