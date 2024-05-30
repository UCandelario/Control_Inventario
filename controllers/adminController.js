const pool = require('../database');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await pool.query('SELECT * FROM Usuarios WHERE rol = "cliente"');
    res.json(clients);
  } catch (error) {
    res.status(500).send('Error fetching clients');
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM Productos');
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    await pool.query('UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?', [nombre, descripcion, precio, stock, id]);
    res.send('Product updated');
  } catch (error) {
    res.status(500).send('Error updating product');
  }
};

exports.addProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    await pool.query('INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock]);
    res.status(201).send('Product added');//res.json({msg:'product added',id:insertedId})
  } catch (error) {
    res.status(500).send('Error adding product');
  }
};
