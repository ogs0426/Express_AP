const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('broadcast', {
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    img_broadcast_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_broadcast_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })
}