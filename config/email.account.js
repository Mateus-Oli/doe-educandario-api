// Envia Emails
const nodemailer = require('nodemailer');

const email = {
  name: 'mateus.oli.car',
  password: 'picolo12'
};

module.exports = nodemailer
  .createTransport(`smtps://${email.name}%40gmail.com:${email.password}@smtp.gmail.com`);
