// Encriptador
const bcrypt = require('bcryptjs');

// Modelo da User
const User = require('../model/User');

/**
 * @desc Inseri um Usuario no banco
 * @param {object}
 * @return {Promise}
 */
const create = (user) => {

  return new Promise((resolve, reject) => {

    // Encripta senha
    bcrypt.hash(user.password, 10, (err, password) => {

      user.password = password;

      // Salva Usuario no Banco
      User.query()
        .insert(user)
        .then((user) => resolve(user));
    });
  });
};

/**
 * @desc Atualiza usuario
 * @param {integer} id
 * @param {string} user
 * @return {Promise}
 */
const update = (id, user) => {

  return new Promise((resolve, reject) => {

    // Encripta nova Senha
    bcrypt.hash(user.password, 10, (err, password) => {

      user.password = password;

      User.query()
        .patchAndFetchById(id, user)
        .then((user) => resolve(user));
    });
  });
};

/**
 * @desc Remove Usuario
 * @param {integer} id
 * @return {Promise}
 */
const remove = (id) => {

  return new Promise((resolve, reject) => {

    User.query()
      .delete()
      .where('id', '=', id)
      .then((user) => resolve(user));
  });
};

module.exports = {
  create,
  update,
  remove
};
