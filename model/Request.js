// Connecting to DataBase
const {Model} = require('objection');
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de Requisição
const Request = function Request() {
  Model.apply(this, arguments);
};

Request.tableName = 'request';
Model.extend(Request);

Request.prototype.$beforeInsert = function() {
  this.created_at = new Date();
  this.updated_at = new Date();
};

Request.prototype.$beforeUpdate = function() {
  this.updated_at = new Date();
};

module.exports = Request;
