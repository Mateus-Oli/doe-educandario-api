// Conexão com Base de Dados
const Model = require('objection').Model;
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de Cupom
const Coupon = function Coupon() {
  Model.apply(this, arguments);
};

Coupon.tableName = 'coupon';
Model.extend(Coupon);

module.exports = Coupon;
