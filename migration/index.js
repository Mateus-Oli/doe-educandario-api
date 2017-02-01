// Banco de Dados
const {knex} = require('../config');

// Tabelas
const coupon  = require('./coupon.migration');
const qrcode  = require('./qrcode.migration');
const request = require('./request.migration');
const user    = require('./user.migration');

// Cria tabelas
const createCoupon  = coupon.up(knex).then(()  => console.log('table coupon created'));
const createQRCode  = qrcode.up(knex).then(()  => console.log('table qrcode created'));
const createRequest = request.up(knex).then(() => console.log('table request created'));
const createUser    = user.up(knex).then(()    => console.log('table user created'));

Promise.all([
  createCoupon,
  createQRCode,
  createRequest,
  createUser
]).then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    return process.exit(1);
  });
