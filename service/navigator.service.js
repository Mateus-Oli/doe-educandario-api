// Métodos do Selenium
const WebDriver = require('selenium-webdriver');

// Métodos para navegação
const By    = WebDriver.By;
const until = WebDriver.until;
const Key   = WebDriver.Key;

// Sobreescreve objeto {Date} e {Number}
require('../override/date.format');

// Configurações para Site
const {DRIVER, SITE} = require('../config');

/**
 * @desc Abre uma instancia de Navegador
 * @return {Promise}
 */
const createBrowser = () => {

  const driver = new WebDriver.Builder().forBrowser(DRIVER).build();
  return driver.get(`${SITE.page}/login.aspx`)
    .then(() => driver);
};

/**
 * @desc Fecha instancia do Navegador
 * @param {object} driver
 * @return {Promise}
 */
const closeBrowser = (driver) => driver.quit();

/**
 * @desc Redireciona navegador para tela de cadastro
 * @param {object} driver
 * @return {Promise}
 */
const toRegister = (driver) => {

  // Tela de Login
  driver.wait(until.elementLocated(By.xpath('//*[@id="UserName"]')));
  driver.findElement(By.xpath('//*[@id="UserName"]')).sendKeys(SITE.user);
  driver.findElement(By.xpath('//*[@id="Password"]')).sendKeys(SITE.password);
  driver.findElement(By.xpath('//*[@id="Login"]')).click();

  //Espera a pagina principal
  driver.wait(until.elementLocated(By.xpath('//*[@id="menuSuperior"]/ul/li[4]/a')));

  //Redireciona ate tela de entidade
  driver.get(`${SITE.page}/EntidadesFilantropicas/CadastroNotaEntidadeAviso.aspx`);

  //Pagina do 'prosseguir'
  driver.wait(until.elementLocated(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')));
  driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')).click();

  //escolhendo entidade
  driver.wait(until.elementLocated(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')));
  driver.findElement(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')).click();
  driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnNovaNota"]')).click();

  //Pagina de cadastro - confirmar 'DIV'
  return driver
    .wait(until.elementLocated(By.xpath('//*[@id="lblPerguntaMaster"]')))
    .sendKeys(Key.ESCAPE)
    .then(() => driver);
};

/**
 * @desc Screenshot do Captcha
 * @param {object} driver
 * @return {Promise}
 */
const captcha = (driver) => driver.findElement(By.xpath('//*[@id="captchaNFP"]'))
  .then(driver.takeScreenshot) /* Foto do Captcha */
  .then((captcha) => {return {driver, captcha};})/* Imagem do Captcha */
  .catch(() => driver); /* Não Exite Captcha */

/**
 * @desc Limpa campos de cadastro
 * @param {object} driver
 * @return {Promise}
 */
const clearFields = (driver) => {

  // Limpa Captcha se Existe
  driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).clear().catch(() => {});

  // Limpa Cupom
  return driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).clear()     /* CNPJ  */
    .then(driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).clear())             /* DATA  */
    .then(driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).clear())             /* COO   */
    .then(driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).clear())             /* TOTAL */
    .then(driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(Key.BACK_SPACE))
    .then(() => driver) /* CUPOM LIMPO */

    // Limpa Chave
    .catch(driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).clear()) /* VALOR */
    .then(driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).sendKeys(Key.BACK_SPACE))
    .then(() => driver); /* CHAVE LIMPA */
};

/**
 * @desc Salva Cupom/Chave
 * @param {object} driver
 * @return {Promise}
 */
const save = (driver) => driver
  .findElement(By.xpath('//*[@id="btnSalvarNota"]')).sendKeys(Key.ENTER)
  .then(driver.findElement(By.xpath('//*[@id="lblErroMaster"]')).getText())
  .then((innerHTML) => innerHTML) /* Erro com DIV */
  .then(driver.findElement(By.xpath('/html/body/div[3]/div[11]/div/button/span')).click())
  .catch(  driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
  .catch(driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
  .then((innerHTML) => innerHTML) /* Erro sem DIV */
  .catch(() => driver)            /* Sucesso no Cadastro */
  .then(clearFields(driver));     /* Limpa para Proximo Cadastro */

/**
 * @desc Inseri dados em formulario de Cupom
 * @param {object} driver
 * @param {object} coupon
 * @return {Promise}
 */
const registerCoupon = (driver, coupon) => driver
  .wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
  .then(driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch(() => {}))
  .then(() => {

    // Preenche Formulario
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(coupon.cnpj);            /* CNPJ    */
    driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).sendKeys(coupon.date.format('dd/MM/yyyy')); /* DATA    */
    driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).sendKeys(coupon.coo);                       /* COO     */
    driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(coupon.total);                     /* TOTAL   */
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(coupon.captcha).catch(() => {});  /* CAPTCHA */

    // Salva Cupom
    return save(driver).then(() => coupon);
  });

/**
* @desc Inseri dados em formulario de Chave
* @param {object} driver
* @param {object} qrcode
* @return {Promise}
*/
const registerQRCode = (driver, qrcode) => driver
  .wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
  .then(driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch(() => {}))
  .then(() => {

    // Preenche Formulario
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(qrcode.value);          /* VALOR   */
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(qrcode.captcha).catch(() => {}); /* CAPTCHA */

    // Salva Cupom
    return save(driver).then(() => qrcode);
  });

module.exports = {
  createBrowser,
  closeBrowser,
  toRegister,
  captcha,
  registerCoupon,
  registerQRCode
};
