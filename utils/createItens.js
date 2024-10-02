const Sequelize = require('sequelize');
const sequelize = require('./database');
const Item = require('../models/Iten');

async function createItems() {
    const items = [
        { name: 'Espada de Prata', description: 'Uma espada brilhante feita de prata.' },
        { name: 'Escudo de Ouro', description: 'Um escudo resistente feito de ouro.' },
        { name: 'Poção de Cura', description: 'Uma poção que cura 50 de vida.' },
        { name: 'Armadura de Couro', description: 'Armadura leve feita de couro.' }
    ];
  
    try {
        await Item.bulkCreate(items);
        console.log('Itens criados com sucesso!');
    } catch (error) {
        console.error('Erro ao criar itens:', error);
    }
  }
  
  // Chame a função para inserir os itens
  createItems();