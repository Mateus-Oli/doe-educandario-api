// Conexão com Base de Dados
const {Model} = require('objection');
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de Cupom
const Coupon = function Coupon() {
  Model.apply(this, arguments);
};

Coupon.tableName = 'coupon';
Model.extend(Coupon);

Coupon.prototype.$beforeInsert = function() {
  this.created_at = new Date();
  this.updated_at = new Date();
};

Coupon.prototype.$beforeUpdate = function() {
  this.updated_at = new Date();
};

module.exports = Coupon;
