// Modelo da Cupom
const QRCode = require('../model/QRCode');

/**
 * @desc Inseri um QRCode no banco
 * @param {object} qrcode
 * @return {Promise}
 */
const create = (qrcode) => {

  return new Promise((resolve, reject) => {

    // Salva QRCode no Banco
    QRCode.query()
      .insert(qrcode)
      .then((qrcode) => resolve(qrcode));
  });
};

/**
 * @desc Agrupa QRCodes por Estado
 * @param {Date} date
 * @return {Promise}
 */
const group = (date) => {
  return new Promise((resolve, reject) => {

    date = date || '2000-01-01';

    QRCode.query()
      .select('status')
      .count('status')
      .groupBy('status')
      .then((qrcodes) => resolve(qrcodes));
  });
};

/**
 * @desc Atualiza cupom
 * @param {id} id
 * @param {object} coupon
 * @return {Promise}
 */
const update = (id, qrcode) => {
  return new Promise((resolve, reject) => {

    QRCode.query()
      .patchAndFetchById(id, qrcode)
      .then((qrcode) => resolve(qrcode));
  });
};

const remove = (id) => {

  return new Promise((resolve, reject) => {

    QRCode.query()
      .delete()
      .where('id', '=', id)
      .then((qrcode) => resolve(qrcode));
  });
};

module.exports = {
  create,
  group,
  update,
  remove
};
