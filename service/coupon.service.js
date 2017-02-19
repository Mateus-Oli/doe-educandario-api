// Modelo da Cupom
const Coupon = require('../model/Coupon');

/**
 * @desc Inseri um novo cupom
 * @param {object} coupon
 * @return {Promise}
 */
const create = (coupon) => Coupon.query().insert(coupon);

/**
 * @desc Lista cupons sem erro de cadstro
 * @return {Promise}
 */
const list = () => Coupon.query().where('status', '!=', 'register err');


/**
 * @desc Lista todos os cupons
 * @return {Promise}
 */
const listAll = () => Coupon.query();

/**
 * @desc Retorna cupom
 * @param {number} id
 * @return {Promise}
 */
const find = (id) => Coupon.query().findById(id);

/**
 * @desc Agrupa cupons por estado
 * @param {Date} date
 * @return {Promise}
 */
const group = () => Coupon.query()
  .select('status')
  .count('status')
  .groupBy('status');

/**
 * @desc Atualiza cupom
 * @param {number} id
 * @param {object} coupon
 * @return {Promise}
 */
const update = (id, coupon) => Coupon.query().patchAndFetchById(id, coupon);

/**
 * @desc Deleta registro do cupom
 * @param {number} id
 * @return {Promise}
 */
const remove = (id) => Coupon.query().deleteById(id);

module.exports = {
  create,
  list,
  listAll,
  find,
  group,
  update,
  remove
};
