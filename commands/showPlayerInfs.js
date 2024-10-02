const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User'); // Certifique-se de que o modelo do User está sendo importado corretamente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infoplayer')
        .setDescription('Shows player information.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to display information')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Obtém o usuário selecionado
        const targetUser = interaction.options.getUser('user');

        // Consulta o banco de dados para obter as informações do player
        let playerData;
        try {
            playerData = await User.findOne({ where: { id: targetUser.id } });
        } catch (error) {
            console.error('Erro ao buscar player:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao buscar o player.', ephemeral: true });
        }

        // Verifica se o player existe no banco de dados
        if (!playerData) {
            return interaction.reply({ content: `O jogador ${targetUser.username} não foi encontrado no banco de dados.`, ephemeral: true });
        }

        // Cria o embed com as informações do player
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Cor da borda do embed
            .setTitle(`${targetUser.username} - Player Info`) // Título com o nome do usuário
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true })) // Avatar do usuário
            .addFields(
                { name: 'Name', value: playerData.name, inline: true },
                { name: 'Money', value: `$${playerData.money}`, inline: true },
                { name: 'Level', value: playerData.level.toString(), inline: true },
                { name: 'Xp', value: `${playerData.experience.toString()}/${playerData.level.toString()*100}`, inline: true }
               
            )
            .setTimestamp()
            .setFooter({ text: 'Player Info', iconURL: interaction.client.user.displayAvatarURL() }); // Footer com a foto do bot

        // Envia a mensagem com o embed
        return interaction.reply({ embeds: [embed] });
    },
};
