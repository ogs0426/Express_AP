module.exports = (sequelize, DataTypes) => {
  return sequelize.define('schedule', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING(10)
    },
    age: {
      type: DataTypes.STRING(5)
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};