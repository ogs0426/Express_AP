const models        = require('../models/index');
const _             = require('lodash');
const common    = require('../utils/common');

const fileKeys  = ['img_program_url'];

/**
 * 프로그램 조회(리스트)
 * use: (client)
 */
exports.list = (req, res) => {
  models.program.findAll()
  .then(result => res.json(result))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 프로그램 조회(페이지)
 * use: (admin)
 */
exports.get = (req, res) => {
  const page = req.params.page || 1;
  const limit = 10;
  let offset = 0;
  
  if (page > 1) {
    offset = limit * (page - 1);
  }
  
  models.program.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']]
  })
  .then(result => res.json({ totalCount: result.count, data: result.rows}))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 프로그램 추가
 * use: (admin)
 */
exports.create = (req, res) => {
  console.log(req)
  const data = common.parseData(req);
  models.program.create(data)
  .then(() => res.status(201).end())
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 프로그램 수정
 * use: (admin)
 */
exports.update = (req, res) => {
  const id = req.params.id || '';
  console.log("update",req)
  const data = common.parseData(req);

  models.program.findOne({
    attributes: fileKeys, 
    where: {id: id}, 
    raw: true 
  })
  .then((result) => {
    models.program.update(data, {where: {id: id}})
    .then(() => {
      res.end();
      common.deleteFilebyUpdate(fileKeys, data, result);
    });
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 프로그램 삭제
 * use: (admin)
 */
exports.delete = (req, res) => {
  const ids = req.body.ids || [];
  
  if (ids.length == 0) {
    return res.status(400);
  }

  models.program.findAll({ 
    attributes: fileKeys, 
    where: {id: ids}, 
    raw: true 
  })
  .then((result) => {
    models.program.destroy({where: {id: ids}})
    .then(() => {
      res.end();
      common.deleteFileAll(fileKeys, result);
    })
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};