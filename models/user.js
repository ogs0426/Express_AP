module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};