// Encriptador
const bcrypt = require('../override/bcrypt');

// Tempo de expiração do token de segurança
const {EXPIRATION} = require('../config');

// Lista de Tokens Validos
const tokens = [];

// Modelo do Usuario
const User = require('../model/User');

// Envia Emails
const mailerService = require('./mailer.service');

/**
 * @desc Valida o Login de um Usuario
 * @param {string} username
 * @param {string} password
 * @return {Promise}
 */
const validate = (username, password) => User
  .query()
  .where('name', '=', username)
  .orWhere('email', '=', username)
  .then((user) => {

    user = user[0];
    if(!user) throw 'invalid username';
    return user;
  }).then((user) => bcrypt.compare(password, user.password)
    .then(() => user))
    .catch(() => {throw 'invalid password';});

/**
 * @desc Reseta Senha do Usuario e Envia Email
 * @param {string} username
 * @return {Promise}
 */
const resetPassword = (username) => User
  .query()
  .where('name', '=', username)
  .orWhere('email', '=', username)
  .then((user) => {

    user = user[0];
    if(!user) throw 'invalid username';

    user.password = Math
      .round(Math.random() * 1000000000)
      .toString();

    return user;
  }).then(mailerService.recoverPassword)
    .then((user) => bcrypt.hash(user.password, 10)
    .then((password) => {
      user.password = password;
      return user;
    })).then((user) => User.query().updateAndFetchById(user.id, user))
       .then((user) => {
         delete user.password;
         return user;
       });

/**
 * @desc Gera token de conexão do usuario
 * @param {object} user
 * @return {Promise}
 */
const generateToken = (user) => bcrypt
  .hash(JSON.stringify(user), 10)
  .then((token) => {

    tokens.push(token);
    setTimeout(() => logOut(token), EXPIRATION);

    delete user.password;
    return {user, token};
  });

/**
 * @desc Desloga Usuario
 * @param {string} token Token de Conexão
 * @return {string[]}
 */
const logOut = (token) => {

  // Remove Token da lista de tokens aceitos
  return Promise.resolve(tokens.splice(tokens.indexOf(token), 1));
};

/**
 * @desc Verifica validade do token enviado
 * @param {string} token
 * @return {bool}
 */
const checkToken = (token) => {

  // Verica se token existe em lista de tokens
  if(tokens.indexOf(token) >= 0) return Promise.resolve();
  return Promise.reject('invalid token');
};

module.exports = {
  validate,
  resetPassword,
  generateToken,
  logOut,
  checkToken
};
