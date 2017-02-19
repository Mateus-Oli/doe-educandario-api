// Conexão com Base de Dados
const {Model} = require('objection');
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de Usuario
const User = function User() {
  Model.apply(this, arguments);
};

User.tableName = 'user';
Model.extend(User);

User.prototype.$beforeInsert = function() {
  this.created_at = new Date();
  this.updated_at = new Date();
};

User.prototype.$beforeUpdate = function() {
  this.updated_at = new Date();
};

module.exports = User;
