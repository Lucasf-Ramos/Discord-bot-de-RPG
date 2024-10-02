const { SlashCommandBuilder, EmbedBuilder,PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('criarnpc')
    .setDescription('Crie um novo NPC')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do NPC')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('nivel')
        .setDescription('Nível do NPC')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('genero')
          .setDescription('Gênero do NPC')
          .setRequired(true)
          .addChoices(
            { name: 'Masculino', value: 'masculino' },
            { name: 'Feminino', value: 'feminino' }
        ))
    .addStringOption(option =>
      option.setName('profissao')
        .setDescription('Profissão do NPC')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('relacao')
        .setDescription('Relação do NPC com outros personagens')
        .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('foto')
          .setDescription('URL da foto do NPC')
          .setRequired(false)
      ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setDMPermission(false),
  async execute(interaction) {
    const nome = interaction.options.getString('nome');
    const nivel = interaction.options.getInteger('nivel');
    const foto = interaction.options.getString('foto');
    const profissao = interaction.options.getString('profissao');
    const relacao = interaction.options.getString('relacao');
    const genero = interaction.options.getString('genero');

    const embed = new EmbedBuilder()
      .setTitle(`${nome} ${genero === 'masculino' ? '<:maleSymbol:1290821033385005139>' : '<:famaleSymbol:1290820976518496318>'}`)
      .setDescription(`Nível: ${nivel}`)
      .setImage(foto)
      .addFields(
        { name: 'Profissão', value: profissao, inline: false },
        { name: 'Relação', value: relacao || 'Nenhuma', inline: false }
      )
      .setColor('#ff9900')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};