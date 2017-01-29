// Connecting to DataBase
const Model = require('objection').Model;
const knex  = require('../config/data.base');
Model.knex(knex);

// Modelo de Requisição
const Request = function Request() {
  Model.apply(this, arguments);
};

Request.tableName = 'request';
Model.extend(Request);

module.exports = Request;
