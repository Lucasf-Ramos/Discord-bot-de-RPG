const Sequelize = require('sequelize');
const sequelize = require('../utils/database'); 
const Item = require('./Iten'); 
const User = require('./User');

// Definindo o modelo UserItem
const UserItem = sequelize.define('userItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.STRING,
        references: {
            model: 'user', // Certifique-se de que o nome da tabela é 'users'
            key: 'id'
        }
    },
    itemId: {
        type: Sequelize.INTEGER, // Corrigi o tipo de STRING para INTEGER, pois o itemId deve corresponder ao tipo de id do modelo Item
        references: {
            model: Item, 
            key: 'id'
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
});

UserItem.belongsTo(Item, { as: 'item', foreignKey: 'itemId' }); 
//UserItem.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = UserItem;
