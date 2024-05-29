const pool = require('../database');

exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await pool.query(
            'SELECT C.id, C.id_producto, P.nombre, P.precio, C.cantidad FROM carrito C JOIN productos P ON C.id_producto = P.id WHERE C.id_usuario = ?',
            [userId]
        );
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos del carrito');
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        // Verificar si el producto ya está en el carrito del usuario
        const [existingProduct] = await pool.query('SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?', [userId, productId]);

        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            await pool.query('UPDATE Carrito SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_producto = ?', [userId, productId]);
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            await pool.query('INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, 1)', [userId, productId]);
        }

        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    try {
        // Verificar si el producto está en el carrito del usuario
        const [existingProduct] = await pool.query('SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?', [userId, productId]);

        if (existingProduct) {
            if (existingProduct.cantidad > 1) {
                // Si la cantidad es mayor a 1, decrementar la cantidad
                await pool.query('UPDATE Carrito SET cantidad = cantidad - 1 WHERE id_usuario = ? AND id_producto = ?', [userId, productId]);
            } else {
                // Si la cantidad es 1, eliminar el producto del carrito
                await pool.query('DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?', [userId, productId]);
            }
            res.status(200).send('Producto eliminado del carrito');
        } else {
            res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
};

exports.placeOrderFromCart = async (req, res) => {
    const userId = req.user.id;

    try {
        // Obtener los productos del carrito
        const cartItems = await pool.query(
            'SELECT C.id_producto, P.precio, C.cantidad FROM Carrito C JOIN productos P ON C.id_producto = P.id WHERE C.id_usuario = ?',
            [userId]
        );

        // Calcular el total
        let total = 0;
        cartItems.forEach(item => {
            total += item.precio * item.cantidad;
        });

        // Crear el pedido
        const result = await pool.query('INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)', [userId, total]);
        const orderId = result.insertId;

        // Crear detalles del pedido
        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO DetallesPedidos (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)',
                [orderId, item.id_producto, item.cantidad, item.precio]
            );
        }

        // Vaciar el carrito
        await pool.query('DELETE FROM Carrito WHERE id_usuario = ?', [userId]);

        res.status(201).send('Pedido realizado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al realizar el pedido');
    }
};
