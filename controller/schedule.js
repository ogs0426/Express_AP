const models = require('../models/index');
const csv = require('fast-csv');
const fs = require('fs');
const iconv = require('iconv-lite');
const _ = require('lodash');
const moment = require('moment');
const Sequelize = require('sequelize');


function add_now_program(data) {
  const now = moment();
  const isTodayData = moment(data[0].date, 'YYYY-MM-DD').isSame(now, 'day');

  const allTimes = _.map(data, 'time');
  const beforeTimes = _.filter(allTimes, (t) => { return moment(t, 'HH:mm:ss').isSameOrBefore(now); });
  const lastIndex = _.findLastIndex(beforeTimes);
  _.forEach(data, (value, index) => { 
    value['time'] = moment(value['time'], 'HH:mm').format('HH:mm')
    value['now'] = !isTodayData ? false : lastIndex === index ? true : false; 
  });
}

/**
 * <요청한 날짜에 편성표 데이터가 없으면 근접 날짜 조회>
 * 1. 해당 날짜 이후의 데이터가 있는지 조회하고 그 날짜에 해당하는 편성표 조회
 * 2. 해당 날짜 이전의 데이터가 있는지 조회하고 그 날짜에 해당하는 편성표 조회
 * 3. 빈 배열 리턴
 * <현재 시간과 가장 가까운 이전 데이터 중 마지막 시간이 현재 방영 프로그램으로 간주>
 */
exports.get = (req, res) => {
  const date = req.params.date || ''
  models.schedule.findAll({
    where: {date: date}, 
    order: [['time', 'ASC']],
    raw: true
  })
  .then((results) => {
    if (_.size(results) > 0) {
      add_now_program(results);
      res.json(results);
    } else {
      res.json([])
      // models.sequelize.query(`SELECT date FROM schedules where date > :date group by date`, {
      //   replacements: { date: date },
      //   type: models.sequelize.QueryTypes.SELECT
      // })
      // .then((nextResults) => {
      //   if (_.size(nextResults) > 0) {
      //     const nextDate = nextResults[0]['date'];
      //     models.schedule.findAll({
      //       where: {date: nextDate}, 
      //       order: [['time', 'ASC']],
      //       raw: true
      //     })
      //     .then((results) => {
      //       add_now_program(results);
      //       res.json(results) 
      //     });
      //   } else {
      //     models.sequelize.query(`SELECT date FROM schedules where date < :date group by date order by date DESC`, {
      //       replacements: { date: date },
      //       type: models.sequelize.QueryTypes.SELECT
      //     })
      //     .then((prevResults) => {
      //       if (_.size(prevResults) > 0) {
      //         const prevDate = prevResults[0]['date'];
      //         models.schedule.findAll({
      //           where: {date: prevDate},
      //           order: [['time', 'ASC']],
      //           raw: true
      //         })
      //         .then((results) => { 
      //           add_now_program(results);
      //           res.json(results) 
      //         });
      //       } else {
      //         res.json([]);
      //       }
      //     });
      //   }
      // });
    }
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
};

exports.range = (req, res) => {
  const { start_date, end_date } = req.query
  models.schedule.findAll({
    where: {
      date: { [Sequelize.Op.between]: [start_date, end_date] },
    },
    order: [['date', 'ASC'], ['time', 'ASC']],
    raw: true
  }).then((results) => {
    add_now_program(results)
    res.json(_.groupBy(results, 'date'))
  })
  .catch(err => res.status(400).json({ message: err.errors[0].message }));
}

exports.month = (req, res) => {
  const month = req.body.month;

  const rawQuery = 'SELECT date FROM schedules where date like %:date group by date';
  const params = { date: month };

  models.sequelize.query(rawQuery, {replacements: params})
    .then(result => res.json(result));
};

exports.upload = (req, res) => {
  let content = fs.readFileSync(req.file.path);
  let utf8content = iconv.decode(content, 'euc-kr');
  let parseObj = {};

  csv.parseString(utf8content, {headers: true})
    .on('error', error => console.log('# [schedule] ERROR = ', error))
    .on('data', (row) => {
      let date = moment(new Date(row.str2, parseInt(row.str3) - 1, row.str4)).format('YYYY-MM-DD');  // 월은 0 ~ 11
      let min = _.size(row.str6) == 1 ? '0' + row.str6 : row.str6;
      let time = moment(row.str5 + min, 'hmm').format('HH:mm');

      if (!_.hasIn(parseObj, date)) {
        parseObj[date] = [];
      }

      parseObj[date].push({
        date: date,
        time: time,
        content: row.str7,
        type: _.toLower(row.str8) == 'live' ? "생방송" : row.str8,
        age: row.str9,
      });
      
    })
    .on('end', (rowCount) => {
      console.log(`# [schedule] parsed ${rowCount} rows`);
      
      _.forEach(parseObj, (value, dateKey) => {
        models.schedule.count({where: {date: dateKey}})
          .then((count) => {
            if (count > 0) {
              models.schedule.destroy({where: {date: dateKey}})
            }
          })
          .then(() => {
            _.forEach(value, (obj) => {
              models.schedule.create(obj);
            });
          })
      });

      const updateDates = _.keys(parseObj);
      res.json(_.join(updateDates, '\n'));

      fs.unlinkSync(req.file.path);
    });
}

//download csv file sample
// exports.download = (res, req) => {
//   res.setHeader('Content-disposition', 'attachment; filename=myFile.csv');
//   res.setHeader('content-type', 'text/csv');
//   var csvStream = csv.createWriteStream({headers: true, objectMode: true});
//   csvStream.pipe(res);
//   csvStream.write({'col1':'val1', 'col2':'val2'});
//   csvStream.end();
// };