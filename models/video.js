'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Video.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    professor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    posterUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    skillLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    students: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    languages: {
      type: DataTypes.STRING,
      allowNull: false
    },
    captions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lectures: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructorRole: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructorAvatar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Video',
    timestamps: true
  });
  return Video;
};
