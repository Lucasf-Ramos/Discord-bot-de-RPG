const { SlashCommandBuilder, EmbedBuilder,PermissionFlagsBits } = require('discord.js');
const Item = require('../models/Iten'); // Certifique-se de que o modelo de Item está sendo importado corretamente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allitens')
        .setDescription('Mostra todos os itens disponíveis no sistema.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false), // Permissão para administradores (8 é a permissão para ADMINISTRATOR)

    async execute(interaction) {
        // Consulta o banco de dados para obter todos os itens
        let items;
        try {
            items = await Item.findAll();
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao buscar os itens.', ephemeral: true });
        }

        // Cria o embed com as informações dos itens
        const embed = new EmbedBuilder()
            .setColor('#ff99ff') // Cor da borda do embed
            .setTitle('Itens Disponíveis') // Título do embed
            .setTimestamp();

        // Adiciona os itens ao embed
        if (items.length > 0) {
            items.forEach(item => {
                embed.addFields({
                    name: `#${item.id}-${item.name}`, // Nome do item
                    value: `   ${item.description}`, // Descrição do item
                    inline: false // Exibe os itens em linha
                });
            });
        } else {
            embed.setDescription('Não há itens disponíveis.');
        }

        // Envia a mensagem com o embed
        return interaction.reply({ embeds: [embed] });
    },
};
