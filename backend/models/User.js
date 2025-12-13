const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    image: { type: String, default: "" },
    address: { type: Object, default: { street: '', city: '', state: '', zip: '', country: '' } },
    cartData: { type: Object, default: {} },
    role: { type: String, default: 'user' }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = userModel;
