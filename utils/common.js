const _   = require('lodash');
const fs  = require('fs');

exports.parseData = (req) => {
  let data = {};
  // 일반 데이터 파싱
  for (bodyKey in req.body) {
    if (req.body[bodyKey] !== 'null') {
      data[bodyKey] = req.body[bodyKey];
    }
  }
  // 파일 이름 파싱
  for (fileKey in req.files) {
    let file = req.files[fileKey][0];
    data[fileKey] = file.filename;
  }
  return data;
};

const uploadRootPath = `${global.__basedir}/upload`;

exports.deleteFilebyUpdate = (fileKeys, data, result) => {
  _.forEach(fileKeys, (key) => {
    const fileName = result[key];
    
    if (_.has(data, key) && !_.isNull(fileName)) {
      const path = `${uploadRootPath}/${fileName}`;
      fs.unlink(path, (err) => {
        if (err) {
          console.log('===# 파일 삭제 에러 : ', err);
        }
      });
    }
  });
};

exports.deleteFileAll = (result) => {
  let fileNameArr = [];
  _.forEach(result, (obj) => {
    fileNameArr = _.concat(fileNameArr, _.values(obj));
  });
  
  _.forEach(fileNameArr, (fileName) => {
    const path = `${uploadRootPath}/${fileName}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.log('===# 멀티 파일 삭제 에러 : ', err);
      }
    });
  });
};