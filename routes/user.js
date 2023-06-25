const bcrypt = require('bcrypt-nodejs');
const models = require('../models/index');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');

router.post('/register', function(req, res, next) {
  const {id, password} = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          models.user.create({id: id, password: hash})
            .then(() => res.status(201).end())
            .catch(err => { res.status(400).json({ message: err.errors[0].message }); });
        }
      });
    }
  });
});

router.post('/login', function(req, res, next) {
  const {id, password} = req.body;

  models.user.findOne({where: { id: id }})
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'Invalid ID or Password.' });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500)({ message: err.message });
        } else {
          if (result) {
            auth.createToken({ id: user.id })
            .then(token => res.json({ access_token: token }));
          } else {
            res.status(401).json({ message: 'Invalid ID or Password.' });
          }
        }
      });
    })
    .catch(err => res.status(400).json({ message: err.errors[0].message }));
});

module.exports = router;
