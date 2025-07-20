const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, trim: true, unique: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true, trim: true },
    productCollection: { type: String, trim: true },
    variants: [variantSchema]
}, {
    timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);
