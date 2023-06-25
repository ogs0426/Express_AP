const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('program', {
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contents: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    img_program_url: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_program_url');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  })
}