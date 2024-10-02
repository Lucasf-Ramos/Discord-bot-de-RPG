const Sequelize = require('sequelize');
const sequelize = require('../utils/database');



const Item = sequelize.define('iten', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
 
  },{freezeTableName: true});
//Item.belongsToMany(User, { through: 'userItems' });

module.exports = Item;

