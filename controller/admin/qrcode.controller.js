// Rotas
const express = require('express');
const router = express.Router();

// Serviços
const qrcodeService = require('../../service/qrcode.service');
const Navigator = require('../../service/navigator.service');

// WebScoket Routes
router.ws('/qrcode', (ws, req) => {

  console.log(req);
  ws.send({body: 'teste'});
});

// Rotas de Cupom
router.route('/qrcode')
  .get((req, res) => Navigator
    .createBrowser() /* Instancia do Navegador */
    .then(Navigator.toRegister) /* Tela de Registro */
    .then(Navigator.captcha) /* ScreenShot do Captcha */
    .then((result) => {

      const {driver, captcha}  = result;

      // Resolve Captcha
      res.send(captcha);
      return driver;

    }).catch((driver) => driver) /* Captcha Não Existe */
      .then((driver) => qrcodeService
      .list() /* Lista QRCodes */
      .then((qrcodes) => qrcodes
      .forEach((qrcode) => Navigator
        .registerQRCode(driver, qrcode) /* Registra QRCode em Site */
        .then((qrcode) => qrcodeService
        .update(qrcode.id, {status: 'registered'})) /* Cadastro Sucesso */
        .catch((err) => {

          // Falha em Captcha ou Cadastro
          return err;
        })))));

module.exports = router;
