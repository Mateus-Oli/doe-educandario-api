// Mailer
const transport = require('../config/email.account');

/**
 * @desc Envia Email de Recuperação de Senha
 * @param {object} user
 * @return {Promise}
 */
const recoverPassword = (user) => {

  return new Promise((resolve, reject) => {

    // Informações do Email
    const options = {
      subject: 'Recuperação de Senha', /* Assunto */
      to: user.email, /* Destinatario */
      text: `
      Bom dia ${user.name},
      Sua nova senha é ${user.password},

      Doe Educandario.
      ` /* Conteudo */
    };

    // Envia Email
    transport.sendMail(options, (err, info) => {
      if(err) return reject(err);
      return resolve(info);
    });
  });
};

module.exports = {
  recoverPassword
};
