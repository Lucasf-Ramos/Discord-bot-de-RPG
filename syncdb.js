const Sequelize = require('sequelize');
const sequelize = require('./utils/database');
const iten = require("./models/Iten");
const User = require("./models/User");
const UserItem = require("./models/userItem");


//user.hasMany(iten);//
//iten.belongsTo(user); 

UserItem.sync({ force: false });
User.sync({ force: false });
iten.sync({ force: false }); // Adicione essa linha
sequelize.sync({ force: false });