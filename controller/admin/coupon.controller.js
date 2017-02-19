// Rotas
const express = require('express');
const router = express.Router();

// Configurações
const { RESOLUTION } = require('../../config');

// Serviços
const couponService = require('../../service/coupon.service');
const Navigator = require('../../service/navigator.service');

// Comunicação por eventos
const Event = require('events');
const event = new Event();

// Rotas de Cupom
router.route('/coupon')
  .get((req, res) => couponService.listAll().then((coupons) => res.json(coupons)))
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
          event.on(`${id}coupon`, (captcha) => resolve({ driver, captcha }));
        });
      })
      .catch(({ driver, timeout }) => {
        if(timeout) return Promise.reject({ driver, timeout }); /* Usuario não respondeu */
        return Promise.resolve({ driver }); /* Captcha não Existe */
      })
      .then(({ driver, captcha }) => couponService.list().then((coupons) => ({ driver, captcha, coupons })))
      .then(({ driver, coupons, captcha }) => {

        // Cadastra Cupons
        return coupons.reduce((promises, coupon) => promises.then(() => {
          coupon.captcha = captcha;
          return Navigator.registerCoupon({ driver, coupon }).then(({ driver, coupon }) => {
            // Ações após Cadastro

            return couponService.update(coupon.id, {status: 'registered'})
              .then(() => ({ driver }));

          }).catch(({driver, err}) => {
            // Erro de Cadastro

            const status = err.match(/Captcha/g)? 'captcha err' : 'register err';

            return couponService.update(coupon.id, {status})
              .then(() => ({ driver }));
          });
        }), Promise.resolve({ driver }));

      }).catch((err) => err).then(Navigator.closeBrowser);
  })
  .post((req, res) => {
    // Resolve Captcha

    const { id } = JSON.parse(req.headers.user);
    const { captcha } = req.body;

    event.emit(`${id}coupon`, captcha);

    return res.json('Cadastrando coupons');
  });

module.exports = router;
