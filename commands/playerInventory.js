const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User'); // Certifique-se de que o modelo do User está sendo importado corretamente
const UserItem = require('../models/userItem');
const Item = require('../models/Iten');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Shows all items a player has.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to show all items for.')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Obtém o usuário selecionado
        const targetUser = interaction.options.getUser('user') || interaction.user;

        // Consulta o banco de dados para obter as informações dos itens do player
        let playerItems;
        try {
            playerItems = await UserItem.findAll({
                where: { userId: targetUser.id },
                include: [
                    {
                        model: Item, // Certifique-se de que o modelo foi importado corretamente
                        as: 'item'  // Verifique o alias, se necessário
                    }
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar itens do player:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao buscar os itens do player.', ephemeral: true });
        }
        
        // Cria o embed com as informações dos itens do player
        let embed = new EmbedBuilder()

    
            .setColor('#0099ff') // Cor da borda do embed
            .setTitle(`${targetUser.username} - Inventário`) // Título com o nome do usuário
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true })) // Avatar do usuário
            .setTimestamp();

        // Adiciona os itens ao embed
        if (playerItems.length > 0) {
            embed.setDescription(playerItems.map(item => `  -${item.item.name} x${item.quantity}`).join('\n'));
        } else {
            embed.setDescription('O jogador não possui nenhum item.');
        }

        // Envia a mensagem com o embed
        return interaction.reply({ embeds: [embed] });
    },
};