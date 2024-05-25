const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, productController.getAllProducts);
router.get('/buscar', authMiddleware, productController.searchProducts);

module.exports = router;
