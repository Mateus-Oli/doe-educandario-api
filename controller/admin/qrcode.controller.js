// Rotas
const express = require('express');
const router = express.Router();

// QRCode
const qrcodeService = require('../../service/qrcode.service');

// Rotas de QRCode
router.route('/qrcode')
  .get((req, res) => {
    qrcodeService.group(req.body.date)
      .then((qrcodes) => res.json(qrcodes))
      .catch((err) => res.status(500).send(err));
  });

module.exports = router;
