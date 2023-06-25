const router     = require('express').Router();
const controller = require('../controller/board');
const auth       = require('../utils/auth');
const multer     = require('../utils/multer');

const upload     = multer.fields([
  {name: 'img_url1'}, 
  {name: 'img_url2'},
  {name: 'img_url3'}, 
  {name: 'file1'},
  {name: 'file2'}, 
  {name: 'file3'}
]);

router.get('/list', controller.list);
router.get('/', controller.get);
router.get('/list/topfix', controller.topfix)
router.get('/search/', controller.search)
router.get('/download/:filename', controller.download);
router.post('/', auth.checkPermission, upload, controller.create);
router.put('/:id', auth.checkPermission, upload, controller.update);
router.delete('/', auth.checkPermission, controller.delete);

module.exports = router;