const Product = require('../models/product');

exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const {
            category,
            productCollection,
            minPrice,
            maxPrice,
            limit = 20,
            page = 1
        } = req.query;

        const query = {};

        if (category) query.category = category;
        if (productCollection) query.productCollection = productCollection;

        const priceFilter = {};
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (!isNaN(min)) priceFilter.$gte = min;
        if (!isNaN(max)) priceFilter.$lte = max;

        if (Object.keys(priceFilter).length > 0) {
            query.price = priceFilter;
        }

        const perPage = parseInt(limit);
        const currentPage = parseInt(page);
        const skip = (currentPage - 1) * perPage;

        const products = await Product.find(query).skip(skip).limit(perPage);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.getLowStock = async (req, res, next) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        const products = await Product.find({
            'variants.stock': { $lt: threshold }
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.updateInventory = async (req, res, next) => {
    try {
        const { variantId, quantity } = req.body;
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({ error: 'Invalid quantity value' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const variant = product.variants.id(variantId);
        if (!variant) return res.status(404).json({ error: 'Variant not found' });

        variant.stock = parsedQuantity;
        await product.save();

        res.json(product);
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
