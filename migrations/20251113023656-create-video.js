'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      professor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      videoUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      posterUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      skillLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      students: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      languages: {
        type: Sequelize.STRING,
        allowNull: false
      },
      captions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lectures: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instructorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instructorRole: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instructorAvatar: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos');
  }
};
