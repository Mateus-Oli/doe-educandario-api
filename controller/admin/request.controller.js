// Rotas
const express = require('express');
const router = express.Router();

// Requisições
const requestService = require('../../service/request.service');

// Rotas de Request
router.route('/request')
  .get((req, res) => requestService
    .list()
    .then((request) => res.json(request))
    .catch((err) => res.status(404).send(err)));

router.route('/request/:id')
  .get((req, res) => requestService
    .find(req.params.id)
    .then((request) => res.json(request))
    .catch((err) => res.status(500).send(err)))

  .delete((req, res) => requestService
    .remove(req.params.id)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err)));

module.exports = router;
