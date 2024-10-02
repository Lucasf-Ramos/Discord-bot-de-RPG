const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const sequelize = require('./utils/database');
const User = require('./models/User');
const Item = require('./models/Iten');
const UserItem = require('./models/userItem');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();



// Definindo a relação muitos para muitos
User.belongsToMany(Item, { through: 'userItems' });
Item.belongsToMany(User, { through: 'userItems' });
//UserItem.belongsTo(Item, { as: 'item', foreignKey: 'itemId' }); // Corrigi o alias de 'iten' para 'item' para manter consistência


// Sincronizando o banco de dados
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Use force: true apenas para desenvolvimento
        console.log('Banco de dados sincronizado!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados:', error);
    }
};

syncDatabase();

// Carregar todos os arquivos de comando da pasta 'commands'
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Define o comando no collection 'commands' usando o nome do comando como chave
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Registra os comandos com a API do Discord
    const commandsArray = client.commands.map(command => command.data);
    client.application.commands.set(commandsArray);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(token);
