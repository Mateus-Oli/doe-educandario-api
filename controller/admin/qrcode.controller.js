// Rotas
const express = require('express');
const router = express.Router();

// Configurações
const { RESOLUTION } = require('../../config');

// Serviços
const qrcodeService = require('../../service/qrcode.service');
const Navigator = require('../../service/navigator.service');

// Comunicação por eventos
const Event = require('events');
const event = new Event();

// Rotas de Cupom
router.route('/qrcode')
  .get((req, res) => qrcodeService.listAll().then((qrcodes) => res.json(qrcodes)))
  .put((req, res) => {
    Navigator.createBrowser() /* Instancia do Navegador */
      .then(Navigator.toRegister) /* Instancia do Navegador */
      .then(Navigator.captcha) /* ScreenShot do Captcha */
      .then((result) => {
        // Resolução do Captcha

        const { captcha, driver } = result;

        const image = new Buffer(captcha, 'base64');

        // Envia o Captcha
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': image.length
        });
        res.end(image);

        // Espera Usuario Resolver Captcha
        return new Promise((resolve, reject) => {

          // Usuario não respondeu a tempo
          setTimeout(() => reject({timeout: true}), RESOLUTION);

          const {id} = JSON.parse(req.headers.user);

          // Usuario Enviou a Resposta
          event.on(`${id}qrcode`, (captcha) => resolve({ driver, captcha }));
        });
      })
      .catch(({ driver, timeout }) => {
        if(timeout) return Promise.reject({ driver, timeout }); /* Usuario não respondeu */
        return Promise.resolve({ driver }); /* Captcha não Existe */
      })
      .then(({ driver, captcha }) => qrcodeService.list().then((qrcodes) => ({ driver, captcha, qrcodes })))
      .then(({ driver, qrcodes, captcha }) => {

        // Cadastra Cupons
        return qrcodes.reduce((promises, qrcode) => promises.then(() => {
          qrcode.captcha = captcha;
          return Navigator.registerQRCode({ driver, qrcode }).then(({ driver, qrcode }) => {
            // Ações após Cadastro

            return qrcodeService.update(qrcode.id, {status: 'registered'})
              .then(() => ({ driver }));

          }).catch(({driver, err}) => {
            // Erro de Cadastro

            const status = err.match(/Captcha/g)? 'captcha err' : 'register err';

            return qrcodeService.update(qrcode.id, {status})
              .then(() => ({ driver }));
          });
        }), Promise.resolve({ driver }));

      }).catch((err) => err).then(Navigator.closeBrowser);
  })
  .post((req, res) => {
    // Resolve Captcha

    const { id } = JSON.parse(req.headers.user);
    const { captcha } = req.body;

    event.emit(`${id}qrcode`, captcha);

    return res.json('Cadastrando qrcodes');
  });

module.exports = router;
