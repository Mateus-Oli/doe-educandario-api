// Banco de Dados
const {knex} = require('../config');

// Tabelas
const coupon  = require('./coupon.migration');
const qrCode  = require('./qrcode.migration');
const request = require('./request.migration');
const user    = require('./user.migration');

// Remove tabelas
const dropCoupon  = coupon.down(knex).then(()  => console.log('table coupon dropped'));
const dropQRCode  = qrCode.down(knex).then(()  => console.log('table qrcode dropped'));
const dropRequest = request.down(knex).then(() => console.log('table request dropped'));
const dropUser    = user.down(knex).then(()    => console.log('table user dropped'));

Promise.all([
  dropCoupon,
  dropQRCode,
  dropRequest,
  dropUser
]).then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    return process.exit(1);
  });
