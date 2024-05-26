const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware'); // Importa el middleware de autenticación
const orderController = require('./controllers/orderController'); // Importa el controlador de pedidos
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Importar y utilizar las rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');  // Importar las rutas del carrito

app.use('/api/auth', authRoutes);
app.use('/api/products', authMiddleware, productRoutes); // Aplica el middleware de autenticación para todas las rutas de productos
app.use('/api/orders', authMiddleware, orderRoutes); // Aplica el middleware de autenticación para todas las rutas de pedidos
app.use('/api/admin', authMiddleware, adminRoutes); // Aplica el middleware de autenticación para todas las rutas de administrador
app.use('/api/cart', authMiddleware, cartRoutes);  // Aplica el middleware de autenticación para todas las rutas del carrito

// Configuración para servir archivos estáticos desde la carpeta 'css'
app.use('/css', express.static(path.join(__dirname, 'css')));

app.use(express.static(path.join(__dirname, 'views')));

// Configuración de rutas para servir páginas HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
  });

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "products.html"));
});

app.get("/orders", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "orders.html"));
});

app.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "cart.html"));
  });

// Verificar el inicio de sesión antes de obtener los pedidos del usuario
app.get('/user-orders', authMiddleware, orderController.getUserOrders);

// Verificar el inicio de sesión antes de crear un nuevo pedido desde el carrito
app.post('/api/cart', authMiddleware, orderController.createOrderFromCart);

// Puerto
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
