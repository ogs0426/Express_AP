const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  var banner = sequelize.define('banner', {
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    use: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sub_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(200)
    },
    img_banner_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_banner_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_banner_mobile_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_banner_mobile_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return banner;
};