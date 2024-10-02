const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('damage_impact')
    .setDescription('replies calculate your damage')
    .addIntegerOption(option =>
        option.setName('dice')
                .setDescription('number in dice')
                .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('power')
                .setDescription('velocity or strength of atack')
                .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('weight')
                .setDescription('weight of atack')
                .setRequired(false)
    )
    .addIntegerOption(option =>
        option.setName('proeficiency')
                .setDescription('all proffs of user')
                .setRequired(false)
    )
    .addIntegerOption(option =>
        option.setName('equipament')
                .setDescription('aditional proffs of equipament')
                .setRequired(false)
    )
   
    

    ,
    async execute(interaction) {

        const dice = interaction.options.getInteger('dice');
        let power = interaction.options.getInteger('power');
        const weight = interaction.options.getInteger('weight') || 1;
        const proeficiency = interaction.options.getInteger('proeficiency') || 0;
        const equipament = interaction.options.getInteger('equipament') || 0;
        let number = (Math.floor(Math.random() * 100) + 1);

        let finalPower = power + (weight *weight)/2 ;
        const damage = Math.floor(dice + finalPower + proeficiency + equipament);
            interaction.reply(`O dano foi de ${damage} \n ${number > 60 ? `O dano teve uma taxa de critico de ${number}%. Totalizando ${damage + Math.floor(damage * number / 100)} `:''}`);
    },
};
