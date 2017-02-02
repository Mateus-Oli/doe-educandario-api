// Rotas
const express = require('express');
const router = express.Router();

// Serviços
const couponService = require('../../service/coupon.service');
const Navigator = require('../../service/navigator.service');

// WebScoket Routes
router.ws('/coupon', (ws, req) => {

  console.log(req);
  ws.send({body: 'teste'});
});

// Rotas de Cupom
router.route('/coupon')
  .get((req, res) => Navigator
    .createBrowser() /* Instancia do Navegador */
    .then(Navigator.toRegister) /* Tela de Registro */
    .then(Navigator.captcha) /* ScreenShot do Captcha */
    .then((result) => {

      const {driver, captcha}  = result;

      // Resolve Captcha
      const image = new Buffer(captcha, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Lenggth': image.length
      });
      res.end(image);
      return driver;

    }).catch((driver) => driver) /* Captcha Não Existe */
      .then((driver) => couponService
      .list() /* Lista Coupons */
      .then((coupons) => coupons
      .forEach((coupon) => Navigator
        .registerCoupon(driver, coupon) /* Registra Cupom em Site */
        .then((coupon) => couponService
        .update(coupon.id, {status: 'registered'})) /* Cadastro Sucesso */
        .catch((err) => {

          // Falha em Captcha ou Cadastro
          return err;
        }))).then(() => Navigator.closeBrowser(driver))));

module.exports = router;
