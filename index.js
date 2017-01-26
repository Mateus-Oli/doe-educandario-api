// API + WebSocket
const app        = require('express')();
const expressWs  = require('express-ws')(app);
const bodyParser = require('body-parser');

// Configurações
const PORT = 8008;

// Controllers
const navigatorCtrl = require('./controller/navigator.controller.js');
const cupomCtrl     = require('./controller/cupom.controller.js');

// Reconhece JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Acrescenta Cabeçalhos necessarios
app.all('*',(req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Valida Login
app.all('*', (req, res, next) => {
  next();
});

// Injeta Rotas
app.use(navigatorCtrl);

// Sobe Aplicação
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
