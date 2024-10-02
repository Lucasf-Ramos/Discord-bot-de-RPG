const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('echo')
        .setDescription('replies with what you say')
        .addStringOption(
            option => option.setName('text').setDescription('put the text to repeat').setRequired(true)
        )
        .addStringOption(
            option => option.setName('speaker').setDescription('name to put in the frase').setRequired(false)
        ),
    async execute(interaction) {
      
        let texto = interaction.options.getString('text') || "...";
        let speaker = interaction.options.getString('speaker')!=null?  `[${interaction.options.getString('speaker')}]:` : "";

        interaction.reply(`${speaker}${texto}`);
    },
};
