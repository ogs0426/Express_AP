const router     = require('express').Router();
const controller = require('../controller/cable');

router.get('/list', controller.list);

module.exports = router;