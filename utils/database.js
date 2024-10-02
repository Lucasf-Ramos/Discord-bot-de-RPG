const  Sequelize  = require("sequelize");
const sequelize = new Sequelize('database', 'nomeUsuario', 'senha', {
    dialect: 'sqlite',
    host: 'localhost',
    storage: "player.sqlite",
    logging:false ,
})

module.exports = sequelize;

