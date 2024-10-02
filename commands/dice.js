const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('replies with what you say')
    .addIntegerOption(
        option => option.setName('max_number').setDescription('roll the dice').setRequired(true)
    ),
    async execute(interaction) {
      
        let maxNumber = interaction.options.getInteger('max_number') || 20;
        let number = Math.floor(Math.random() * (maxNumber - 2)) + 1;
        interaction.reply(`Vamos rolar o d${interaction.options.getInteger('max_number')} \n O numero é: <:d20:1290414630643961896>${number}`)
    },
};
