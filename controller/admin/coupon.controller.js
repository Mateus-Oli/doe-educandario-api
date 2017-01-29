// Rotas
const express = require('express');
const router = express.Router();

// Cupom
const couponService = require('../../service/coupon.service');

// Rotas de Cupom
router.route('/coupon')
  .get((req, res) => {
    couponService.group(req.body.date)
      .then((coupons) => res.json(coupons))
      .catch((err) => res.status(500).send(err));
  });

module.exports = router;
