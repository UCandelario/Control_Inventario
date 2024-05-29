const pool = require("../database");

exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await pool.query(
            "SELECT * FROM pedidos WHERE id_usuario = ?",
            [userId]
        );

        for (const order of orders) {
            const productos = await pool.query(
                `SELECT p.nombre, dp.cantidad, dp.precio
                 FROM detallespedidos dp
                 JOIN productos p ON dp.id_producto = p.id
                 WHERE dp.id_pedido = ?`,
                [order.id]
            );
            order.productos = productos;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
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
                "SELECT precio FROM productos WHERE id = ?",
                [producto.id_producto]
            );
            total += product.precio * producto.cantidad;
        }

        const result = await pool.query(
            "INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)",
            [userId, total]
        );
        const orderId = result.insertId;

        for (const producto of productos) {
            await pool.query(
                "INSERT INTO detallespedidos (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)",
                [orderId, producto.id_producto, producto.cantidad, producto.precio]
            );
        }

        res.status(201).send("Order created");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating order");
    }
};

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        // Primero, eliminar los detalles del pedido para activar el trigger
        await pool.query("DELETE FROM detallespedidos WHERE id_pedido = ?", [orderId]);
        // Luego, eliminar el pedido en sí
        await pool.query("DELETE FROM pedidos WHERE id = ?", [orderId]);

        res.status(200).send("Order cancelled");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error cancelling order");
    }
};
