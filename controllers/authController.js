const pool = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword]);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
    const user = users[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};
