const router     = require('express').Router()
const controller = require('../controller/schedule');
const auth       = require('../utils/auth');
const multer     = require('../utils/multer');

const upload = multer.single('file');

router.get('/date/:date', controller.get);
router.get('/month/:month', controller.month);
router.get('/range', controller.range);
router.post('/upload', auth.checkPermission, upload, controller.upload);

module.exports = router;