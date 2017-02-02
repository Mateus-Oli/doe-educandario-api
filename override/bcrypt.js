// Tranforma métodos bcrypt em promises

const bcrypt = require('bcryptjs');

/**
 * @desc Cria hash utilizando bcrypt
 * @param {string} hash
 * @param {number} salt
 * @return {promise}
 */
const hash = (text, salt) => new Promise((resolve, reject) => {

  bcrypt.hash(text, salt, (err, hash) => {
    if(err) return reject(err);
    return resolve(hash);
  });
});

/**
 * @desc Compara texto com hash utilizando bcrypt
 * @param {string} text
 * @param {number} hash
 * @return {promise}
 */
const compare = (text, hash) => new Promise((resolve, reject) => {

  return bcrypt.compare(text, hash, (err, res) => {
    if(err || !res) return reject(err);
    return resolve(res);
  });
});


module.exports = {
  hash,
  compare
};
