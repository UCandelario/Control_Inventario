const pool = require('../database');

exports.getAllProducts = async (req, res) => {
    try {
      const products = await pool.query('SELECT * FROM productos');
      res.json(products); // Enviar todos los productos sin desestructurar
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
    }
  };
  
  exports.searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
      const products = await pool.query('SELECT * FROM productos WHERE nombre LIKE ?', [`%${query}%`]);
      res.json(products); // Enviar todos los productos sin desestructurar
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).send('Error searching products');
    }
  };
  