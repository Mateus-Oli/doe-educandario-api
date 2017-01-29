// Modelo da Request
const Request = require('../model/Request');

/**
 * @desc Removes Information from Request
 * @param {object} request
 * @return {Request}
 */
const info = (request) => {
  return {
    ip: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
    protocol: request.protocol,
    method: request.method,
    agent: request.headers['user-agent'],
    host: request.headers.host,
    url: request.url,
    body: JSON.stringify(request.body)
  };
};

/**
 * @desc Inseri uma requisição no banco
 * @param {object} request requisição a ser inserida
 * @return {Promise}
 */
const create = (request) => {

  return new Promise((resolve, reject) => {

    // Informações da Requisição
    const req = info(request);

    // Salva Requisição no Banco
    Request.query()
      .insert(req)
      .then((request) => resolve(request));
  });
};

/**
 * @desc Seleciona request no banco
 * @param {object} id requisição a ser inserida
 * @return {Promise}
 */
const find = (id) => {
  return new Promise((resolve, reject) => {

    Request.query()
      .where('id', '=', id)
      .then((request) => resolve(request[0]));
  });
};

const remove = (id) => {

  return new Promise((resolve, reject) => {

    Request.query()
      .delete()
      .where('id', '=', id)
      .then((request) => resolve(request));
  });
};

module.exports = {
  create,
  find,
  remove
};
