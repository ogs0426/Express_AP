const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  var contact = sequelize.define('contact', {
    dept: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contents: {
      type: DataTypes.TEXT,
      defaultValue: false
    },
    contact1_team: {
      type: DataTypes.STRING(50),
      defaultValue: false
    },
    contact1_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contact1_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contact2_team: {
      type: DataTypes.STRING(50)
    },
    contact2_name: {
      type: DataTypes.STRING(50)
    },
    contact2_email: {
      type: DataTypes.STRING(100),
    },
    
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return contact;
};