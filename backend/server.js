const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars immediately
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const customOrderRouter = require('./routes/customOrderRoute');
const festivalRouter = require('./routes/festivalRoute');
const galleryRouter = require('./routes/galleryRoute');
const sellerRouter = require('./routes/sellerRoute');

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.enable('trust proxy');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/custom-order', customOrderRouter);
app.use('/api/festival', festivalRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/seller', sellerRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Force nodemon restart
// Server updated
