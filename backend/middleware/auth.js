const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Auth Middleware - Token Verified. Decoded:", token_decode);
        if (req.body && typeof req.body === 'object') {
            req.body.userId = token_decode.id;
        }
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = authMiddleware;
