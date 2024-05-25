const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, orderController.getUserOrders);
router.post('/', authMiddleware, orderController.createOrder);

module.exports = router;
