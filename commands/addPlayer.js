const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Associates a user from the server to the database.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to associate')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    
    async execute(interaction) {
        // Defer reply to give more time to respond
        await interaction.deferReply({ ephemeral: true });

        
        const addUser = interaction.options.getUser('user');

        // Check if the user is already in the database
        const existingUser = await User.findOne({ where: { id: addUser.id } });

        if (existingUser) {
            return interaction.editReply(`O usuário ${addUser.username} já está registrado no sistema.`);
        }

        // Create the new user with default level 1 and money 0
        try {
            await User.create({
                id: addUser.id,
                name: addUser.username,  // Associate the user's tag
                level: 1,                // Default level
                money: 0                 // Default money
            });

            return interaction.editReply(`Usuário ${addUser.username} foi adicionado com sucesso! Começando no nível 1 com 0 de dinheiro.`);
        } catch (error) {
            console.error('Erro ao adicionar o usuário:', error);
            return interaction.editReply('Houve um erro ao adicionar o usuário. Tente novamente mais tarde.');
        }
    },
};
