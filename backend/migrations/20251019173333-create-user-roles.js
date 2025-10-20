"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert many-to-many join table into a one-to-many relationship
    // by adding a roleId foreign key column on Users.
    // Make it nullable and use SET NULL on delete to be safe with seeding/order.
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'roleId');
  },
};
