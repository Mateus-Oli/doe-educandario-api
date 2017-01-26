// Métodos do Selenium
const WebDriver = require('selenium-webdriver');

// Métodos para navegação
const by    = WebDriver.By;
const until = WebDriver.until;
const key   = WebDriver.key;

/**
 * @desc Abre uma instancia de Navegador
 * @return {WebDriver} driver
 */
const createBrowser = () => {

  // Phantom JS
  return new WebDriver.Builder().forBrowser('phantomjs');
};

// Funções para Navegação
module.exports = {
  createBrowser
};
