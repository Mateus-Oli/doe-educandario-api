// Modelo da QRCode
const QRCode = require('../model/QRCode');

/**
 * @desc Inseri um QRCode no banco
 * @param {object} qrcode
 * @return {Promise}
 */
const create = (coupon) => QRCode.query().insert(coupon);

/**
 * @desc Lista qrcodes
 * @return {Promise}
 */
const list = () => QRCode.query();

/**
 * @desc Lista qrcodes em banco
 * @return {Promise}
 */
const find = (id) => QRCode.query().findById(id);


/**
 * @desc Agrupa QRCodes por Estado
 * @param {Date} date
 * @return {Promise}
 */
const group = (date) => QRCode.query()
  .select('status')
  .count('status')
  .groupBy('status')

/**
 * @desc Atualiza cupom
 * @param {id} id
 * @param {object} coupon
 * @return {Promise}
 */
const update = (id, qrcode) => QRCode.query().patchAndFetchById(id, qrcode);

/**
 * @desc Deleta registro do qrcode
 * @param {number} id
 * @return {Promise}
 */
const remove = (id) => QRCode.query().deleteById(id);

module.exports = {
  list,
  create,
  group,
  update,
  remove
};
