// Rotas
const express = require('express');
const router = express.Router();

// Validador de Login
const loginService = require('../../service/login.service');

// Usuario
const userService = require('../../service/user.service');

// Rotas de Usuario
router.route('/logout')
  .get((req, res) => loginService
    .logOut(req.headers.token)
    .then(() => res.json('OK'))
    .catch((err) => res.status(500).send(err)));

router.route('/password')
  .put((req, res) => {

    // Usuario a trocar de senha
    const {id} = JSON.parse(req.headers.user);
    const body = req.body;

    userService
      .update(id, body)
      .then(() => res.json('OK'))
      .catch((err) => res.status(500).send(err));
  });

module.exports = router;
