const models = require('../models/index');
const fs = require('fs');

const path = `${__dirname}/json/cable.json`

module.exports = function() {
  models.cable.count({}).then(
    async (count) => {
    console.log("[SEED] Cable Data :", count)
    if(count === 0) {
      await insertAll()
  	} else {
      models.sequelize.transaction(
        async (t) => {
          await deleteAll({
            where: {},
            transaction: t
          })
          await insertAll({
            transaction: t
          })
        })
    }
  })
}

const insertAll = async (o = {}) => {
  try {
    // JSON파일이 BOM 형식일 경우 position 0 에러 회피
    var data =  fs.readFileSync(path, 'utf8').substring(1)
    console.log(JSON.parse(data.toString()))
    await models.cable.bulkCreate(JSON.parse(data.toString()), o)
  } catch (err) {
    console.log(err)
  }
}

const deleteAll = async (o = {}) => {
  try {
    await models.cable.destroy(o)
  } catch (err) {
    console.log(err)
  }
}