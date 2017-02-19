// Connecting to DataBase
const {Model} = require('objection');
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de QRCode
const QRCode = function QRCode() {
  Model.apply(this, arguments);
};

QRCode.tableName = 'qrcode';
Model.extend(QRCode);

QRCode.prototype.$beforeInsert = function() {
  this.created_at = new Date();
  this.updated_at = new Date();
};

QRCode.prototype.$beforeUpdate = function() {
  this.updated_at = new Date();
};

module.exports = QRCode;
