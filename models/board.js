const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  var board = sequelize.define('board', {
    board_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top_fix: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bottom_img: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    img_url1: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_url1');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_url2: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_url2');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    img_url3: {
      type: DataTypes.STRING(200),
      get() {
        const url = this.getDataValue('img_url3');
        return _.size(url) > 0 ? process.env.STATIC_HOST + url : '';
      }
    },
    file1: {
      type: DataTypes.STRING(200)
    },
    file2: {
      type: DataTypes.STRING(200)
    },
    file3: {
      type: DataTypes.STRING(200)
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return board;
};