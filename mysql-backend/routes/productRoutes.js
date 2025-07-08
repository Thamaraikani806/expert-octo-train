const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.js');
const auth = require('../middleware/auth.js');
const { createProduct, listProducts, getProduct,
        updateProduct, deleteProduct } = require('../controllers/productController.js');

router.post('/create', auth, upload.single('image'), createProduct);

router.get('/list', auth, listProducts);

router.get('/:id', auth, getProduct);
 
router.put('/:id', auth, upload.single('image'), updateProduct);

router.delete('/:id', auth, deleteProduct);


module.exports = router;