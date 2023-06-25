const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('link', {
    link_url: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sub_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    img_link_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_link_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_link_mobile_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_link_mobile_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    actor1_name: {
      type: DataTypes.STRING(50),
    },
    actor2_name: {
      type: DataTypes.STRING(50),
    },
    actor3_name: {
      type: DataTypes.STRING(50),
    },
    actor4_name: {
      type: DataTypes.STRING(50),
    },
    img_actor1_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_actor1_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_actor2_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_actor2_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_actor3_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_actor3_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_actor4_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_actor4_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })
}