const pool = require("../database");

exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await pool.query(
      "SELECT * FROM Pedidos WHERE id_usuario = ?",
      [userId]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send("Error fetching orders");
  }
};

exports.createOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productos } = req.body;
  let total = 0;

  try {
    for (const producto of productos) {
      const [product] = await pool.query(
        "SELECT precio FROM Productos WHERE id = ?",
        [producto.id_producto]
      );
      total += product.precio * producto.cantidad;
    }

    const result = await pool.query(
      "INSERT INTO Pedidos (id_usuario, total) VALUES (?, ?)",
      [userId, total]
    );
    const orderId = result.insertId;

    for (const producto of productos) {
      await pool.query(
        "INSERT INTO DetallesPedidos (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)",
        [orderId, producto.id_producto, producto.cantidad, producto.precio]
      );
    }

    res.status(201).send("Order created");
  } catch (error) {
    res.status(500).send("Error creating order");
  }
};
