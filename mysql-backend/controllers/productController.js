const db = require('../config/db.js');
const fs = require('fs');
const path = require('path');
const { off } = require('process');

const listProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const searchQuery = `%${search}%`;

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM products 
       WHERE name LIKE ? OR description LIKE ? OR brand LIKE ?`,
      [searchQuery, searchQuery, searchQuery]
    );

    const [products] = await db.query(
      `SELECT p.*, u.firstName, u.email 
       FROM products p 
       JOIN users u ON p.userId = u.id 
       WHERE p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?
       LIMIT ? OFFSET ?`,
      [searchQuery, searchQuery, searchQuery, limit, offset]
    );

    res.json({ products, totalPages: Math.ceil(total / limit), page, });
  } catch (err) {
    res.status(500).json({ message: 'List failed', error: err.message });
  }
};

const createProduct = async (req, res) => {
  const { productId, name, description, price, brand } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const [exists] = await db.query('SELECT * FROM products WHERE productId = ?', [productId]);
    if (exists.length) return res.status(400).json({ message: 'Product ID already exists' });

    await db.query(
      'INSERT INTO products (productId, name, description, price, brand, image, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, name, description, price, brand, image, req.user.userId]
    );

    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { productId, name, description, price, brand, status } = req.body;
  const updateFields = [productId, name, description, price, brand, status, req.params.id];

  try {
    const sql = 
     `UPDATE products 
      SET productId = ?, name = ?, description = ?, price = ?, brand = ?, status = ?
      WHERE id = ? `;

    if (req.file) {
      const [[old]] = await db.query('SELECT image FROM products WHERE id = ?', [req.params.id]);
      if (old.image) {
        const filePath = path.join(__dirname, '../uploads', old.image);
        fs.existsSync(filePath) && fs.unlinkSync(filePath);
      }
      updateFields.splice(5, 0, req.file.filename);
      const sqlWithImage = 
       `UPDATE products 
        SET productId = ?, name = ?, description = ?, price = ?, brand = ?, image = ?, status = ?
        WHERE id = ? `;
        
      await db.query(sqlWithImage, updateFields);
    } else {
      await db.query(sql, updateFields);
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [[{ image }]] = await db.query('SELECT image FROM products WHERE id = ?', [req.params.id]);
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (image) {
      const imgPath = path.join(__dirname, '../uploads', image);
      fs.existsSync(imgPath) && fs.unlinkSync(imgPath);
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = { listProducts, createProduct, getProduct, updateProduct, deleteProduct }