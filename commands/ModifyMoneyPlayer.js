const { SlashCommandBuilder,PermissionFlagsBits } = require('discord.js');
const User = require('../models/User'); // Certifique-se de importar o modelo User corretamente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Add or remove money from a player.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The player to modify the money for.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to add/remove (negative to remove).')
                .setRequired(true)
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // Busca o player no banco de dados
        let playerData;
        try {
            playerData = await User.findOne({ where: { id: targetUser.id } });
        } catch (error) {
            console.error('Erro ao buscar o player:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao buscar o player.', ephemeral: true });
        }

        // Verifica se o player existe no banco de dados
        if (!playerData) {
            return interaction.reply({ content: `O jogador ${targetUser.username} não foi encontrado no banco de dados.`, ephemeral: true });
        }

        // Modifica o saldo do player
        const newBalance = playerData.money + amount;

        if (newBalance < 0) {
            return interaction.reply({ content: `O jogador ${targetUser.username} não pode ter saldo negativo.`, ephemeral: true });
        }

        try {
            await playerData.update({ money: newBalance });
        } catch (error) {
            console.error('Erro ao atualizar o saldo do player:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao atualizar o saldo do player.', ephemeral: true });
        }

        // Responde com a atualização do saldo
        return interaction.reply({ content: `${amount >= 0 ? 'Adicionado' : 'Removido'} $${Math.abs(amount)} na conta de ${targetUser.username}. Saldo atual: $${newBalance}` });
    },
};
