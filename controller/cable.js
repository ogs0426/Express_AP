const models        = require('../models/index');
const _             = require('lodash');

exports.list = (req, res) => {
  models.cable.findAll()
  .then(result => res.json(result))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
}