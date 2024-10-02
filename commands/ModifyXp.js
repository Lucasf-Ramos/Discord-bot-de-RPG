const { SlashCommandBuilder,PermissionFlagsBits } = require('discord.js');
const User = require('../models/User'); // Certifique-se de importar o modelo User corretamente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Add or remove experience from a player.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The player to modify the experience for.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of experience to add/remove (negative to remove).')
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
        let newBalance = playerData.experience + amount;
        let level = playerData.level;

        if (newBalance < 0) {
            // Se o novo saldo for negativo, calcula quantos levels o jogador perdeu
            const levelsLost = Math.floor(Math.abs(newBalance) / 100);
            // Atualiza o level do jogador
            await playerData.update({ experience: 0, level: Math.max(playerData.level - levelsLost, 1) });
        } else {
            // Se o novo saldo não for negativo, verifica se o jogador ganhou levels
            while (newBalance >= level * 100) {
               
                level++;
                newBalance -= level * 100;
               
            }
        }
           
        try {
            await playerData.update({ experience: newBalance, level: level });
        } catch (error) {
            console.error('Erro ao atualizar o xp do player:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao atualizar o saldo do player.', ephemeral: true });
        }

        // Responde com a atualização do saldo
        return interaction.reply({ content: `${targetUser.username} ${amount >= 0 ? 'Ganhou' : 'Perdeu'} ${Math.abs(amount)} de Expericencia. \n Xp atual: ${newBalance} \n Level atual: ${level}` });
    },
};
