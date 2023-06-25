'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "timezone": process.env.DB_TIMEZONE,
  "dialect": process.env.DB_DIALECT,
  "dialectOptions": {
    "useUTC": false,
    "dateStrings": true,
    "typeCast": true
  },
  "pool": {
    "max": parseInt(process.env.DB_POOL_MAX),
	  "min": parseInt(process.env.DB_POOL_MIN),
	  "acquire": parseInt(process.env.DB_POOL_ACQUIRE),
	  "idle": parseInt(process.env.DB_POOL_IDLE)
  }
}
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
