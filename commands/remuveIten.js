const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../models/User');
const Item = require('../models/Iten');
const UserItem = require('../models/userItem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeitem')
        .setDescription('Remove an item from a player.')
        .addUserOption(option =>
            option.setName('player')
                .setDescription('The player to remove the item from.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('itemname')
                .setDescription('The name of the item to remove.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('itemid')
                .setDescription('The ID of the item to remove.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('The quantity of the item to remove.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('player');
        const itemName = interaction.options.getString('itemname');
        const itemId = interaction.options.getInteger('itemid');
        const quantityToRemove = interaction.options.getInteger('quantity') || 1;

        try {
            // Busca o player no banco de dados
            const player = await User.findOne({ where: { id: targetUser.id } });
            if (!player) {
                return interaction.reply({ content: `O jogador ${targetUser.username} não foi encontrado no banco de dados.`, ephemeral: true });
            }

            // Busca o item no banco de dados
            const item = await Item.findOne({ where: { name: itemName } }) || await Item.findOne({ where: { id: itemId } });
            if (!item) {
                return interaction.reply({ content: `O item "${itemName}" não foi encontrado.`, ephemeral: true });
            }

            // Busca o item do jogador no banco de dados
            const userItem = await UserItem.findOne({ where: { userId: player.id, itemId: item.id } });
            if (!userItem) {
                return interaction.reply({ content: `O jogador ${targetUser.username} não possui o item "${item.name}".`, ephemeral: true });
            }

            // Verifica se a quantidade a remover é maior que a quantidade que o jogador possui
            if (quantityToRemove > userItem.quantity) {
                return interaction.reply({ content: `O jogador ${targetUser.username} não possui ${quantityToRemove} ${item.name}.`, ephemeral: true });
            }

            // Remove a quantidade do item do jogador
            userItem.quantity -= quantityToRemove;
            await userItem.save();

            // Se a quantidade do item for igual a 0, remove o item do jogador
            if (userItem.quantity === 0) {
                await userItem.destroy();
            }

            return interaction.reply({ content: `O item "${item.name}" foi removido do jogador ${targetUser.username}.`, ephemeral: true });
        } catch (error) {
            console.error('Erro ao remover o item do jogador:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao remover o item do jogador.', ephemeral: true });
        }
    }
};