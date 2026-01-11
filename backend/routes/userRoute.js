const express = require('express');
const { loginUser, registerUser, adminLogin, getProfile, updateProfile, allUsers, addToWishlist, removeFromWishlist, requestProduct, getAllRequests, handleRequest, addAddress, updateSecondaryAddress, deleteAddress, contactFormEmail } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');
const userRouter = express.Router();

userRouter.post('/register', upload.single('image'), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.post('/update-profile', authMiddleware, upload.single('image'), updateProfile);
userRouter.post('/all-users', allUsers);
userRouter.post('/wishlist/add', authMiddleware, addToWishlist);
userRouter.post('/wishlist/remove', authMiddleware, removeFromWishlist);
userRouter.post('/request', authMiddleware, requestProduct);
userRouter.get('/admin/requests', authMiddleware, getAllRequests);
userRouter.post('/admin/request-handle', authMiddleware, handleRequest);
userRouter.post('/add-address', authMiddleware, addAddress);
userRouter.post('/update-address', authMiddleware, updateSecondaryAddress);
userRouter.post('/delete-address', authMiddleware, deleteAddress);
userRouter.post('/contact', contactFormEmail);

module.exports = userRouter;
