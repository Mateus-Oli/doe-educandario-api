// Connecting to DataBase
const Model = require('objection').Model;
const {knex}  = require('../config');
Model.knex(knex);

// Modelo de QRCode
const QRCode = function QRCode() {
  Model.apply(this, arguments);
};

QRCode.tableName = 'qrcode';
Model.extend(QRCode);

module.exports = QRCode;
