// Rotas
const express = require('express');
const router = express.Router();

// QRCode
const qrcodeService = require('../../service/qrcode.service');

// Rotas de QRCode
router.route('/qrcode')
  .post((req, res) => {
    qrcodeService.create(req.body)
      .then((qrcode) => res.json(qrcode))
      .catch((err) => res.status(500).send(err));
  });

module.exports = router;
