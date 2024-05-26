module.exports = (req, res, next) => {
    if (req.user.rol !== 'admin') return res.status(403).send('Admin role required');
    next();
  };
