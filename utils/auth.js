const jwt = require('jsonwebtoken');

exports.createToken = (payload) => {
  return new Promise((resolve, reject) => {
    const options = { expiresIn: '1d', issuer: 'mezzo' };
    const token = jwt.sign(payload, process.env.SECRET_KEY, options);
    resolve(token);
  });
};

exports.checkPermission = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'You don\'t have permission.' });
  
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: err });
    next();
  });
};