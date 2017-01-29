// Conexão com Base de Dados
const Model = require('objection').Model;
const knex  = require('../config/data.base');
Model.knex(knex);

// Modelo de Usuario
const User = function User() {
  Model.apply(this, arguments);
};

User.tableName = 'user';
Model.extend(User);

module.exports = User;
