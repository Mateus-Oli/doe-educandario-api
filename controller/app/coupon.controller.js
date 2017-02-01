// Rotas
const express = require('express');
const router = express.Router();

// Cupom
const couponService = require('../../service/coupon.service');

// Rotas de Cupom
router.route('/coupon')
  .post((req, res) => couponService
    .create(req.body)
    .then((coupon) => res.json(coupon))
    .catch((err) => res.status(500).send(err)));

module.exports = router;
