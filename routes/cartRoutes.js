const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para obtener los productos del carrito
router.get('/', authMiddleware, cartController.getCart);

// Ruta para agregar productos al carrito
router.post('/', authMiddleware, cartController.addToCart);

// Ruta para eliminar una unidad de un producto del carrito
router.delete('/:productId', authMiddleware, cartController.removeFromCart);

// Ruta para realizar el pedido desde el carrito
router.post('/place-order', authMiddleware, cartController.placeOrderFromCart);

module.exports = router;
