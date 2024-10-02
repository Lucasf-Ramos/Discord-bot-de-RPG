const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('percent')
    .setDescription('replies calculate a percent')
    .addIntegerOption(option =>
        option.setName('number')
                .setDescription('total number')
                .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('percentual')
                .setDescription('percentual number')
                .setRequired(true)
    )
   
   
    

    ,
    async execute(interaction) {
            const percent = interaction.options.getInteger('percentual');
            const number = interaction.options.getInteger('number');
            const result = (percent * number) / 100;
            const total = number + result;
       
            interaction.reply(`${percent}% de ${number} é ${result} \n (soma total e ${total}) \n (subtração total é ${number - result})`);
    },
};
