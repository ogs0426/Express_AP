const models    = require('../models/index');
const Sequelize = require('sequelize');
const _         = require('lodash');
const common    = require('../utils/common');

const fileKeys  = [
  'img_url1', 
  'img_url2',
  'img_url3', 
  'file1',
  'file2', 
  'file3'
];

/**
 * 게시글 전체 조회(리스트)
 * use: ?
 */
exports.list = (req, res) => {
  models.board.findAll({
    attributes: [
      'id', 'board_type', 'top_fix', 'bottom_img', 'title', 'content', 'img_url1', 'img_url2', 'img_url3', 'file1', 'file2', 'file3',
      [Sequelize.fn('date_format', Sequelize.col('created_at'), '%Y-%m-%d'), 'created_at']
    ]
  })
  .then(result => res.json(result))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 게시글 키워드 조회
 * use: (client)
 */
exports.search = (req, res) => {
  const { keyword } = req.query
  models.board.findAndCountAll({
    attributes: [
      'id', 'board_type', 'top_fix', 'bottom_img', 'title', 'content', 'img_url1', 'img_url2', 'img_url3', 'file1', 'file2', 'file3',
      [Sequelize.fn('date_format', Sequelize.col('created_at'), '%Y-%m-%d'), 'created_at']
    ],
    where: {
      title: {
        [Sequelize.Op.like]: `%${keyword}%`
      }
    }
  }).then(result => res.json({ totalCount: result.count, data: result.rows}))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
}

/**
 * 게시글 상단공지만 조회
 * use: (client)
 */
exports.topfix = (req, res) => {
  const limit = 10;
  let offset = 0;
  let page = 1;

  if (page > 1) {
    offset = limit * (page - 1);
  }
  models.board.findAndCountAll({
    attributes: [
      'id', 'board_type', 'top_fix', 'bottom_img', 'title', 'content', 'img_url1', 'img_url2', 'img_url3', 'file1', 'file2', 'file3',
      [Sequelize.fn('date_format', Sequelize.col('created_at'), '%Y-%m-%d'), 'created_at']
    ],
    where: {'top_fix': true},
    offset: offset,
    limit: limit,
    order: [['created_at', 'DESC'],['id', 'DESC']]
  }).then(result => res.json({ totalCount: result.count, data: result.rows}))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
}

/**
 * 게시글 조회(페이지)
 * use: (client, admin)
 */
exports.get = (req, res) => {
  const page = req.query.page || 1;
  const limit = Number(req.query.limit) || 10;
  const keyword = req.query.keyword || ""
  let offset = 0;
  
  if (page > 1) {
    offset = limit * (page - 1);
  }

  let options = {
    attributes: [
      'id', 'board_type', 'bottom_img', 'top_fix', 'title', 'content', 'img_url1', 'img_url2', 'img_url3', 'file1', 'file2', 'file3',
      [Sequelize.fn('date_format', Sequelize.col('created_at'), '%Y-%m-%d'), 'created_at']
    ],
    offset: offset,
    limit: limit,
    where: {
      title: {
        [Sequelize.Op.like]: `%${keyword}%`
      }
    },
    order: [['top_fix', 'DESC'],['created_at', 'DESC'],['id', 'DESC']]
  };
  console.log("offset", page)
  models.board.findAndCountAll(options)
  .then(result => res.json({ totalCount: result.count, data: result.rows}))
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 게시글 추가
 * use: (admin)
 */
exports.create = (req, res) => {
  const data = common.parseData(req);
  models.board.create(data)
  .then(() => res.status(201).end())
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 게시글 수정
 * use: (admin)
 */
exports.update = (req, res) => {
  const id = req.params.id || '';
  const data = common.parseData(req);

  models.board.findOne({
    attributes: fileKeys, 
    where: {id: id}, 
    raw: true 
  })
  .then((result) => {
    models.board.update(data, {where: {id: id}})
    .then(() => {
      res.end();
      common.deleteFilebyUpdate(fileKeys, data, result);
    });
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 게시글 삭제
 * use: (admin)
 */
exports.delete = (req, res) => {
  const ids = req.body.ids || [];
  
  if (ids.length == 0) {
    return res.status(400);
  }

  models.board.findAll({ 
    attributes: fileKeys, 
    where: {id: ids}, 
    raw: true 
  })
  .then((result) => {
    models.board.destroy({where: {id: ids}})
    .then(() => {
      res.end();
      common.deleteFileAll(fileKeys, result);
    })
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

/**
 * 게시글 다운로드
 * use: (admin)
 */
exports.download = (req, res) => {
  if (req.params.filename) {
    res.download('./upload/' + req.params.filename, (err) => {
      console.log('download error = ', err);
    });
  }
};