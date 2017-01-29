/**
 * @desc Cria tabela de Cupom
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Criada
 */
const up = (knex) => {
  return knex.schema.createTableIfNotExists('coupon', (table) => {

    //Chave Primaria
    table.increments('id').unsigned().primary();

    // Dados do Cupom
    table.string('coo', 6).notNull();
    table.date('date').notNull();
    table.string('cnpj', 14).notNull();
    table.decimal('total', 11, 2).notNull();

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
 * @desc Remove tabela de cupom
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Removida
 */
const down = (knex) => knex.schema.dropTableIfExists('coupon');

module.exports = {
  up,
  down
};
