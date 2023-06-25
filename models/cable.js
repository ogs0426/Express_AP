const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('cable', {
    idx: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    channel: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    location_do_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    location2: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    broadcast: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cable_num: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    sd_num: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    hd_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_num: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    edit_yn: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    reg_date: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    timestamps: false,
    underscored: true
  })
}