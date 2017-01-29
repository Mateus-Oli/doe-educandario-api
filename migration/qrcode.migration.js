/**
 * @desc Cria tabela de QRCode
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Criada
 */
const up = (knex) => {
  return knex.schema.createTableIfNotExists('qrcode', (table) => {

    //Chave Primaria
    table.increments('id').unsigned().primary();

    // Dados do QRCode
    table.text('value').notNull();

    // Situação do cadastro
    table.enum('status',[
      'not registered',
      'registered',
      'register err',
      'captcha err'
    ]).default('not registered');

    // Informação de criação e atualização
    table.timestamps();
  });
};

/**
 * @desc Remove tabela de QRCode
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Removida
 */
const down = (knex) => knex.schema.dropTableIfExists('qrcode');

module.exports = {
  up,
  down
};
