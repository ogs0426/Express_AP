const router     = require('express').Router();
const controller = require('../controller/channel');
const auth       = require('../utils/auth');
const multer     = require('../utils/multer');

const upload     = multer.fields([{name: 'img_channel_url'}]);

router.get('/list', controller.list);
router.get('/:page', controller.get);
router.post('/', auth.checkPermission, upload, controller.create);
router.put('/:id', auth.checkPermission, upload, controller.update);
router.delete('/', auth.checkPermission, controller.delete);

module.exports = router;