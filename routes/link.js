const router     = require('express').Router();
const controller = require('../controller/link');
const auth       = require('../utils/auth');
const multer     = require('../utils/multer');

const upload     = multer.fields([
  {name: 'img_link_url'},
  {name: 'img_link_mobile_url'},
  {name: 'img_actor1_url'},
  {name: 'img_actor2_url'},
  {name: 'img_actor3_url'},
  {name: 'img_actor4_url'}
]);

router.get('/list', controller.list);
router.get('/target/:link', controller.target);
router.get('/:page', controller.get);
router.post('/', auth.checkPermission, upload, controller.create);
router.put('/:id', auth.checkPermission, upload, controller.update);
router.delete('/', auth.checkPermission, controller.delete);

module.exports = router;