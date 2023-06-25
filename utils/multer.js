const uuidv4 = require('uuid/v4');
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("[MULTER] request: ", req)
    console.log("[MULTER] file: ", file)
    callback(null, 'upload/');
  },
  filename: (req, file, callback) => {
    const uuid = uuidv4().replace(/-/g, '');  // 파일이름 unique하게 변경
    callback(null, uuid + path.extname(file.originalname));
  }
});

module.exports = multer({storage: storage});
