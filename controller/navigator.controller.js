// Server
const express = require('express');

// Navegação
const Navigator = require('../service/navigator.service.js');

// Rotas de Navegação
const router = express.Router();

router.route('/')

  .get((req, res) => {

    // driver para navegação
    const driver = Navigator.createBrowser();

    return res.json(driver);
  });


// Retorna rotas a serem utilizadas
module.exports = router;
