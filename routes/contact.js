const router     = require('express').Router();
const controller = require('../controller/contact');

router.get('/list', controller.list);

module.exports = router;