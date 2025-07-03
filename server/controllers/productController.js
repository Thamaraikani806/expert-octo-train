const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const listProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const searchRegex = new RegExp(search, 'i'); 
    const filter = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
      ],
    };

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName email');

    const total = await Product.countDocuments(filter);
    res.json({ products, total, page, totalPages: Math.ceil(total / limit)});

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

const createProduct = async (req, res) => {
  const { id, name, description, price, brand } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const existing = await Product.findOne({ id });
    if (existing) return res.status(400).json({ message: 'Product ID already exists' });

    const product = new Product({ id, name, description, price, brand, image, userId: req.user._id, status: 'active'  });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
  }
};



const editProduct = async (req, res) => {
  const { id: pId, name, description, price, brand } = req.body;
  const update = { id: pId, name, description, price, brand };

  if (req.file) update.image = req.file.filename;

  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(req.params.id);

    if (product.image) {
      const imagePath = path.join(__dirname, '../uploads/', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Image delete error:', err.message);
      });
    }

    res.json({ message: 'Product and image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load product', error: err.message });
  }
};

const ProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.status = product.status === 'active' ? 'inactive' : 'active';
    await product.save();

    res.json({ message: `Product is now ${product.status}`, status: product.status });
  } catch (err) {
    res.status(500).json({ message: 'Status toggle failed', error: err.message });
  }
};


module.exports = { listProduct, createProduct, editProduct, deleteProduct, getProduct, ProductStatus };

