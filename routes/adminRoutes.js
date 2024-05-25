const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/clientes', authMiddleware, adminMiddleware, adminController.getAllClients);
router.get('/productos', authMiddleware, adminMiddleware, adminController.getAllProducts);
router.put('/productos/:id', authMiddleware, adminMiddleware, adminController.updateProduct);
router.post('/productos', authMiddleware, adminMiddleware, adminController.addProduct);

module.exports = router;
