// Modelo da Cupom
const Coupon = require('../model/Coupon');

/**
 * @desc Lista cupons em banco
 * @return {Promise}
 */
const list = () => {

  return new Promise((resolve, reject) => {

    Coupon.query()
      .then((coupons) => resolve(coupons));
  });
};

/**
 * @desc Inseri um Cupom no banco
 * @param {object} coupon
 * @return {Promise}
 */
const create = (coupon) => {

  return new Promise((resolve, reject) => {

    // Salva Cupom no Banco
    Coupon.query()
      .insert(coupon)
      .then((coupon) => resolve(coupon));
  });
};

/**
 * @desc Agrupa Cupons por Estado
 * @param {Date} date
 * @return {Promise}
 */
const group = (date) => {
  return new Promise((resolve, reject) => {

    date = date || '2000-01-01';

    Coupon.query()
      .select('status')
      .count('status')
      .groupBy('status')
      .then((coupons) => resolve(coupons));
  });
};

/**
 * @desc Atualiza cupom
 * @param {id} id
 * @param {object} coupon
 * @return {Promise}
 */
const update = (id, coupon) => {
  return new Promise((resolve, reject) => {

    Coupon.query()
      .patchAndFetchById(id, coupon)
      .then((coupon) => resolve(coupon));
  });
};

const remove = (id) => {

  return new Promise((resolve, reject) => {

    Coupon.query()
      .delete()
      .where('id', '=', id)
      .then((coupon) => resolve(coupon));
  });
};

module.exports = {
  list,
  create,
  group,
  update,
  remove
};
