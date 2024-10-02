const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('replies with your name')
    .addUserOption(
        option => option.setName('user').setDescription('user to say hi!').setRequired(false)
    ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user.username;

            interaction.reply(`Olá ${user}! \nMeu nome é Orpheus, muito prazer em conhecer-te! \nMinha função nesse mundo é proporcionar a ti uma experiencia de jogo interessante, sinta-se a voltade para usar meus comandos! teru~nyan`);
    },
};
