/**
 * @desc Cria tabela de Requisicao
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Criada
 */
const up = (knex) => {
  return knex.schema.createTableIfNotExists('request', (table) => {

    //Chave Primaria
    table.increments('id').unsigned().primary();

    // Dados da Requisicao
    table.string('ip', 100).notNull();
    table.string('protocol', 100).notNull();
    table.string('method', 100).notNull();
    table.string('host', 100).notNull();
    table.string('url', 100).notNull();
    table.text('body').notNull();
    table.text('agent').notNull();

    // Informação de criação e atualização
    table.timestamps();
  });
};

/**
 * @desc Remove tabela de Requisicao
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Removida
 */
const down = (knex) => knex.schema.dropTableIfExists('request');

module.exports = {
  up,
  down
};
