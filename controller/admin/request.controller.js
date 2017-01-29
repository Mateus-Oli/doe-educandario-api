// Rotas
const express = require('express');
const router = express.Router();

// Modelo de Request
const Request = require('../../model/Request');
const requestService = require('../../service/request.service');

// Rotas de Request
router.route('/request')
  .get((req, res) => {
    Request.query().then((request) => res.json(request));
  });

router.route('/request/:id')
  .get((req, res) => {
    requestService.find(req.params.id)
      .then((request) => res.json(request))
      .catch((err) => res.status(500).send(err));
  })
  .delete((req, res) => {
    requestService.remove(req.params.id)
      .then((resut) => res.json(result))
      .catch((err) => res.status(500).send(err));
  });

module.exports = router;
