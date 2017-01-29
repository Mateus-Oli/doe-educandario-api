// Encriptador
const bcrypt = require('bcryptjs');

// Tempo
const SECONDS = 1000,
      MINUTES = 60 * SECONDS,
      HOURS    = 60 * MINUTES;

// Tempo de expiração do token de segurança
const EXPIRATION = 2 * HOURS;

// Lista de tokens validos
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
const validate = (username, password) => {

  return new Promise((resolve, reject) => {

    // Usuario ou senha Vazios
    if(!username) return reject('invalid username');
    if(!password) return reject('invalid password');

    // Seleciona usuario informado
    User.query().where('name', '=', username)
                .orWhere('email', '=', username)
                .then((user) => {

      user = user[0];
      if(user[0]) return reject('invalid user');

      // Verifica validade da senha
      bcrypt.compare(password, user.password, (err, res) => {

        if(res) return resolve(user);
        return reject('invalid password');
      });
    });
  });
};

/**
 * @desc Reseta Senha do Usuario e Envia Email
 * @param {string} email
 * @return {Promise}
 */
const resetPassword = (email) => {

  return new Promise((resolve, reject) => {

    // Usuario Resetando Senha
    User.query()
      .where('email', '=', email)
      .orWhere('name', '=', email)
      .then((user) => {

        user = user[0];
        user.password = Math.round(Math.random() * 10000000000).toString();

        mailerService.recoverPassword(user)
          .then(() => {
            bcrypt.hash(user.password, 10, (err, password) => {

              user.password = password;
              User.query()
                .updateAndFetchById(user.id, user)
                .then((user) => {
                  delete user.password;
                  return resolve(user);
                });
            });
          });
      });
  });
};

/**
 * @desc Gera token de conexão do usuario
 * @param {object} user
 * @return {Promise}
 */
const generateToken = (user) => {

  return new Promise((resolve, reject) => {

    // Gera um hash como token
    bcrypt.hash(user.toString(), 10, (err, token) => {

      //Adiciona token para tokens aceitos
      tokens.push(token);

      //Expira o Token
      setTimeout(() => {

        // Remove token dos tokens aceitos
        logOut(token);
      }, EXPIRATION);

      // Prepara usuario para retorno
      user.token = token;
      delete user.password;

      return resolve(user);
    });
  });
};

/**
 * @desc Desloga Usuario
 * @param {string} token Token de Conexão
 * @return {string[]}
 */
const logOut = (token) => {

  return new Promise((resolve, reject) => {

    // Remove Token da lista de tokens aceitos
    resolve(tokens.splice(tokens.indexOf(token), 1));
  });
};

/**
 * @desc Verifica validade do token enviado
 * @param {string} token
 * @return {bool}
 */
const checkToken = (token) => {

  return new Promise((resolve, reject) => {

    // Verica se token existe em lista de tokens
    if(tokens.indexOf(token) >= 0) return resolve();
    return reject('invalid token');
  });
};

module.exports = {
  validate,
  resetPassword,
  generateToken,
  logOut,
  checkToken
};
