// Métodos do Selenium
const WebDriver = require('selenium-webdriver');

// Métodos para navegação
const By    = WebDriver.By;
const until = WebDriver.until;
const Key   = WebDriver.Key;

// Sobreescreve objeto {Date} e {Number}
require('../override/date.format');

// Configurações para Site
const { DRIVER, SITE } = require('../config');

/**
 * @desc Abre uma instancia de Navegador
 * @return {Promise}
 */
const createBrowser = () => {

  const driver = new WebDriver.Builder().forBrowser(DRIVER).build();
  return driver.get(`${ SITE.page }/login.aspx`)
    .then(() => ({ driver }));
};

/**
 * @desc Fecha instancia do Navegador
 * @param {Object} option
 * @return {Promise}
 */
const closeBrowser = ({ driver }) => driver.quit();

/**
 * @desc Redireciona navegador para tela de cadastro
 * @param {Object} option
 * @return {Promise}
 */
const toRegister = (option) => {

  const { driver } = option;

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
    .then(() => option);
};

/**
 * @desc Screenshot do Captcha
 * @param {Object} option
 * @return {Promise}
 */
const captcha = ({ driver }) => driver.findElement(By.xpath('//*[@id="captchaNFP"]'))
  .then(() => driver.takeScreenshot()) /* Foto do Captcha */
  .then((captcha) =>  ({ driver, captcha }))/* Imagem do Captcha */
  .catch(() => ({ driver })); /* Não Exite Captcha */

/**
 * @desc Limpa campos de cadastro
 * @param {Object} option
 * @return {Promise}
 */
const clearFields = (option) => {

  const { driver } = option;

  // Limpa Captcha se Existe
  driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).clear().catch(() => {});

  // Limpa Cupom
  return driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).clear()     /* CNPJ  */
    .then(() => {
      driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).clear();                 /* DATA  */
      driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).clear();                 /* COO   */
      driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).clear();                 /* TOTAL */
      driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(Key.BACK_SPACE);

      return option;
    })
    // Limpa Chave
    .catch(() => {
      driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).clear();      /* VALOR */
      driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).sendKeys(Key.BACK_SPACE);

      return option;
    });
};

/**
 * @desc Salva Cupom/Chave
 * @param {Object} option
 * @return {Promise}
 */
const save = (option) => {

  const { driver } = option;

  return driver.findElement(By.xpath('//*[@id="btnSalvarNota"]')).sendKeys(Key.ENTER)
  .then(() => driver.findElement( By.xpath('//*[@id="lblErroMaster"]')).getText())
  .then((innerHTML) => {

    option.err = innerHTML;
    return option;
  }) /* Erro com DIV */
  .then(() => driver.findElement(By.xpath('/html/body/div[3]/div[11]/div/button/span')).click())
  .catch(() => driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
  .catch(() => driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
  .then((innerHTML) => {

    option.err = innerHTML;
    return option;
  }) /* Erro sem DIV */
  .catch(() => option)              /* Sucesso no Cadastro */
  .then(() => clearFields(option))  /* Limpa para Proximo Cadastro */
  .then(() => {
    if(option.err) return Promise.reject(option);
    return Promise.resolve(option);
  });
};

/**
 * @desc Insere dados em formulario de Cupom
 * @param {object} option
 * @return {Promise}
 */
const registerCoupon = (option) => {

  const { driver, coupon } = option;

  return driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
  .then(() => driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch(() => {}))
  .then(() => {

    // Preenche Formulario
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(coupon.cnpj);            /* CNPJ    */
    driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).sendKeys(coupon.date.format('dd/MM/yyyy')); /* DATA    */
    driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).sendKeys(coupon.coo);                       /* COO     */
    driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(coupon.total);                     /* TOTAL   */
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(coupon.captcha).catch(() => {});     /* CAPTCHA */

    // Salva Cupom
    return save(option);
  });
};

/**
* @desc Insere dados em formulario de Chave
* @param {Object} option
* @return {Promise}
*/
const registerQRCode = (option) => {

  const { driver, qrcode } = option;

  return driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
  .then(() => driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch(() => {}))
  .then(() => {

    // Preenche Formulario
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(qrcode.value);       /* VALOR   */
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(qrcode.captcha).catch(() => {}); /* CAPTCHA */

    // Salva Cupom
    return save(option);
  });
};

module.exports = {
  createBrowser,
  closeBrowser,
  toRegister,
  captcha,
  registerCoupon,
  registerQRCode
};
