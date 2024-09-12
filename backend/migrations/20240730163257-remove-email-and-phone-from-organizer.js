'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Organizers', 'email');
    await queryInterface.removeColumn('Organizers', 'phone');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Organizers', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.addColumn('Organizers', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
