const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const Item = require('../models/Iten'); // Importa o modelo Item

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createitem')
        .setDescription('Creates a new item in the database.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the item.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the item.')
                .setRequired(true)
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const itemName = interaction.options.getString('name');
        const itemDescription = interaction.options.getString('description');

        try {
            // Cria o novo item no banco de dados
            const newItem = await Item.create({
                //id: interaction.id,  // Usa o id da interação como id do item, ou crie seu próprio identificador.
                name: itemName,
                description: itemDescription,
            });

            return interaction.reply({ content: `Item "${itemName}" criado com sucesso!`, ephemeral: true });
        } catch (error) {
            console.error('Erro ao criar o item:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao criar o item.', ephemeral: true });
        }
    },
};
