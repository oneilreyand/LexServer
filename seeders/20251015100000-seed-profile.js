'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = require('uuid');
    await queryInterface.bulkInsert('Profiles', [{
      id: uuidv4(),
      userId: '77104f73-b965-4100-b8b1-232404ba585f',
      name: 'resya',
      lastName: 'aqila',
      avatar: 'https://example.com/avatar.jpg',
      address: 'Jl. Contoh No. 123',
      phoneNumber: '+6281234567890',
      provinsi: 'Jawa Barat',
      kotaKabupaten: 'Bandung',
      kecamatan: 'Coblong',
      githubLink: 'https://github.com/johndoe',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', { userId: '77104f73-b965-4100-b8b1-232404ba585f' }, {});
  }
};
