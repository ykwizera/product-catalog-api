const Joi = require('joi');

// Validate user registration
const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'admin')
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

// Validate user login
const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

// Validate product creation
const validateProduct = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        price: Joi.number().required(),
        discountPrice: Joi.number(),
        category: Joi.string().required(),
        productCollection: Joi.string().allow(''),
        variants: Joi.array().items(
            Joi.object({
                size: Joi.string().allow(''),
                color: Joi.string().allow(''),
                stock: Joi.number().min(0),
                sku: Joi.string().required()
            })
        )
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProduct
};
