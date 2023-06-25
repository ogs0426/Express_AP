const models        = require('../models/index');
const _             = require('lodash');
const common    = require('../utils/common');

const fileKeys  = ['img_link_url', 'img_link_mobile_url', 'img_actor1_url', 'img_actor2_url', 'img_actor3_url', 'img_actor4_url'];

/**
 * 링크 조회(리스트)
 * use: (client)
 */
exports.list = (req, res) => {
  models.link.findAll()
  .then(result => res.json(result))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 링크 조회(리스트)
 * use: (client)
 */
exports.target = (req, res) => {
  const target = req.params.link || '';
  models.link.findOne({
    where:{'link_url':target},
  })
  .then(result => res.json(result))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 링크 조회(페이지)
 * use: (admin)
 */
exports.get = (req, res) => {
  const page = req.params.page || 1;
  const limit = 10;
  let offset = 0;
  
  if (page > 1) {
    offset = limit * (page - 1);
  }
  
  models.link.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']]
  })
  .then(result => res.json({ totalCount: result.count, data: result.rows}))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 링크 추가
 * use: (admin)
 */
exports.create = (req, res) => {
  const data = common.parseData(req);
  models.link.create(data)
  .then(() => res.status(201).end())
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 링크 수정
 * use: (admin)
 */
exports.update = (req, res) => {
  const id = req.params.id || '';
  const data = common.parseData(req);

  models.link.findOne({
    attributes: fileKeys, 
    where: {id: id}, 
    raw: true 
  })
  .then((result) => {
    models.link.update(data, {where: {id: id}})
    .then(() => {
      res.end();
      common.deleteFilebyUpdate(fileKeys, data, result);
    });
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 링크 삭제
 * use: (admin)
 */
exports.delete = (req, res) => {
  const ids = req.body.ids || [];
  
  if (ids.length == 0) {
    return res.status(400);
  }

  models.link.findAll({ 
    attributes: fileKeys, 
    where: {id: ids}, 
    raw: true 
  })
  .then((result) => {
    models.link.destroy({where: {id: ids}})
    .then(() => {
      res.end();
      common.deleteFileAll(fileKeys, result);
    })
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};