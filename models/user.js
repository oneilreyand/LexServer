'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: 'userId', as: 'profile' });
      User.hasMany(models.UserActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    googleId: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true
  });
  return User;
};
