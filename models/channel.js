const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('channel', {
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img_channel_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_channel_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })
}