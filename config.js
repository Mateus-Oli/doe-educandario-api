// Argumento de produção
const PRODUCTION = process.argv[2] === 'production';

// Informações Relacionadas ao site da receita
const SITE = {
  page:     'https://www.nfp.fazenda.sp.gov.br',
  user:     '45667474840',
  password: 'segredo2102'
};

// Email que enviara emails do sistema (Gmail)
const EMAIL = {
  user:     'mateus.oli.car',
  password: 'picolo12'
};

// Porta alocada para aplicação
const PORT = 8008;

// Tempo de Expiração do Token de Conexão
const EXPIRATION = (2)*(60)*(60)*(1000);

// Acesso a WebDrivers
if(PRODUCTION)  process.env.Path += `;${__dirname}\\node_modules\\phantomjs-prebuilt\\lib\\phantom\\bin\\`;
if(!PRODUCTION) process.env.Path += `;${__dirname}\\node_modules\\chromedriver\\lib\\chromedriver\\`;

const DRIVER = PRODUCTION
  ?'phantomjs'
  :'chrome';

// Informações de Conexão com banco
let connection;
if(PRODUCTION) connection = {
  host: 'localhost',
  user: 'postgres',
  password: 'mateus123mudar',
  database: 'ebm_notas'
}; /* DIGITAL */
if(!PRODUCTION) connection = {
  host: 'ec2-54-163-248-218.compute-1.amazonaws.com',
  user: 'palffuboakjyaz',
  password: 'FMMpU1-5Ot5STXlJvbrgKaIyt6',
  database: 'ddorvpnoikl99p',
  ssl: true
}; /* HEROKU */

// Configurações de Módulos

// Comunicação com banco
const knex = require('knex')({
  client: 'pg',
  connection
});

// Envia Emails
const mailer = require('nodemailer')
  .createTransport(`smtps://${EMAIL.user}%40gmail.com:${EMAIL.password}@smtp.gmail.com`);

module.exports = {
  SITE,
  EXPIRATION,
  DRIVER,
  PORT,

  mailer,
  knex
};
