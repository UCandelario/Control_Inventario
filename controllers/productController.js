const pool = require('../database');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM Productos');
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const products = await pool.query('SELECT * FROM Productos WHERE nombre LIKE ?', [`%${query}%`]);
    res.json(products);
  } catch (error) {
    res.status(500).send('Error searching products');
  }
};
