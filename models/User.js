const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const UserItem = require('./userItem');


const User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  experience: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  money: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
},{freezeTableName: true});
User.prototype.addItem = async function(item) {
  const userItem = await UserItem.create({
    userId: this.id,
    itemId: item.id
  });
  return userItem;
};

//User.belongsToMany(Item, { through: 'userItems' });
module.exports = User;

