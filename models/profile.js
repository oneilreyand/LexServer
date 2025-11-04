'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Profile.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    avatar: DataTypes.STRING,
    address: DataTypes.TEXT,
    phoneNumber: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    kotaKabupaten: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    githubLink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
    timestamps: true
  });
  return Profile;
};
