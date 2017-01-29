/**
 * @desc Cria tabela de Usuarios
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Criada
 */
const up = (knex) => {
  return knex.schema.createTableIfNotExists('user', (table) => {

    //Chave Primaria
    table.increments('id').unsigned().primary();

    // Dados do Usuario
    table.string('email', 100).unique().notNull();
    table.string('name', 100).unique().notNull();
    table.text('password').notNull();

    // Informação de criação e atualização
    table.timestamps();
  });
};

/**
 * @desc Remove tabela de Usuario
 * @param {knex} knex instancia do Knex
 * @return {Table} Tabela Removida
 */
const down = (knex) => knex.schema.dropTableIfExists('user');

module.exports = {
  up,
  down
};
