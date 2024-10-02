const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('distace')
    .setDescription('replies with calc of time to go of A to B in Seconds')
    .addIntegerOption(option =>
        option.setName('velocity')
                .setDescription('velocity in m/s')
                .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('distance')
                .setDescription('distance in meters')
                .setRequired(true)
    )
   
   
    

    ,
    async execute(interaction) {
           const distance = interaction.options.getInteger('distance');
           const velocity = interaction.options.getInteger('velocity');
           const time = distance/velocity;
       
            interaction.reply(`para percorrer ${distance}m com a velocidade de ${velocity}m/s \n leva-se  ${time>60? `${Math.floor(time/60)}min ${time%60 > 0 ? `e ${time%60}s `: '' }`:`${time}s`}`);
    },
};
