// Configuração do banco de dados

module.exports = require('knex')({
  client: 'pg',

  /** @production */
  // connection: {
  //   host: '45.55.197.218',
  //   user: 'postgres',
  //   password: 'mateus123mudar',
  //   database: 'ebm_notas'
  // }

  /** @development */
  connection: {
    host: 'ec2-54-163-248-218.compute-1.amazonaws.com',
    user: 'palffuboakjyaz',
    password: 'FMMpU1-5Ot5STXlJvbrgKaIyt6',
    database: 'ddorvpnoikl99p',
    ssl: true
  }
});
