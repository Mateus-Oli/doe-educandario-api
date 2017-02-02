// Encriptador
const bcrypt = require('../override/bcrypt');

// Modelo da User
const User = require('../model/User');

/**
 * @desc Inseri um Usuario no banco
 * @param {object}
 * @return {Promise}
 */
const create = (user) => bcrypt
  .hash(user.password, 10)
  .then((password) => {
    user.password = password;
    return user;
  }).then(User.query().insert);

/**
 * @desc Atualiza usuario
 * @param {integer} id
 * @param {string} user
 * @return {Promise}
 */
const update = (id, user) => bcrypt
  .hash(user.password, 10)
  .then((password) => User.query().updateAndFetchById(id, {password}));

/**
 * @desc Remove Usuario
 * @param {number} id
 * @return {Promise}
 */
const remove = (id) => User.query().deleteById(id);

module.exports = {
  create,
  update,
  remove
};
