const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const User = require('../models/User');  // Importa o modelo User
const Item = require('../models/Iten');  // Importa o modelo Item
const UserItem = require('../models/userItem');  // Importa o modelo UserItem
module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveitem')
        .setDescription('Give an item to a player.')
        .addUserOption(option =>
            option.setName('player')
                .setDescription('The player to give the item to.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('itemname')
                .setDescription('The name of the item to give.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('itemid')
                .setDescription('The ID of the item to give.')
                .setRequired(false)
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('player');
        const itemName = interaction.options.getString('itemname');
        const itemId = interaction.options.getInteger('itemid');

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

            // Verifica se o jogador já possui o item
            const userItem = await UserItem.findOne({ where: { userId: player.id, itemId: item.id } });
            if (userItem) {
            // Se o jogador já possui o item, adiciona +1 na quantidade
            userItem.quantity += 1;
            await userItem.save();
            } else {
            // Se o jogador não possui o item, adiciona o item ao jogador
            await player.addItem(item);
            }
            return interaction.reply({ content: `O item "${item.name}" foi dado ao jogador ${targetUser.username}!`, ephemeral: true });
        } catch (error) {
            console.error('Erro ao dar o item ao jogador:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao dar o item ao jogador.', ephemeral: true });
        }
    },
};

