// Mailer
const {mailer} = require('../config');

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
    mailer.sendMail(options, (err) => {
      if(err) return reject(err);
      return resolve(user);
    });
  });
};

module.exports = {
  recoverPassword
};
