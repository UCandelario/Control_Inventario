const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener órdenes del usuario
router.get('/', authMiddleware, orderController.getUserOrders);

// Crear una orden desde el carrito
router.post('/', authMiddleware, orderController.createOrderFromCart);

module.exports = router;
