// Métodos do Selenium
const WebDriver = require('selenium-webdriver');

// Métodos para navegação
const By    = WebDriver.By;
const until = WebDriver.until;
const Key   = WebDriver.Key;

// Configurações para Site
const user  = require('../config/site.account');

// Sobreescreve objeto {Date} e {Number}
require('../config/date.format');

/**
 * @desc Abre uma instancia de Navegador
 * @return {Promise}
 */
const createBrowser = () => {

  return new Promise((resolve, reject) => {

    // Phantom JS na Pagina da Receita
    const driver = new WebDriver.Builder().forBrowser('chrome').build();
    driver.get(`${user.page}/login.aspx`)
      .then(() => resolve(driver));
  });
};

/**
 * @desc Fecha instancia do Navegador
 * @param {object} driver
 * @return {Promise}
 */
const closeBrowser = (driver) => {

  return new Promise((resolve, reject) => {
    driver.quit()
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

/**
 * @desc Redireciona navegador para tela de cadastro
 * @param {object} driver
 * @return {Promise}
 */
const toRegister = (driver) => {

  return new Promise((resolve, reject) =>  {

    // Tela de Login
    driver.wait(until.elementLocated(By.xpath('//*[@id="UserName"]')));
    driver.findElement(By.xpath('//*[@id="UserName"]')).sendKeys(user.cpf);
    driver.findElement(By.xpath('//*[@id="Password"]')).sendKeys(user.password);
    driver.findElement(By.xpath('//*[@id="Login"]')).click();

    //Espera a pagina principal
    driver.wait(until.elementLocated(By.xpath('//*[@id="menuSuperior"]/ul/li[4]/a')));

    //Redireciona ate tela de entidade
    driver.get(`${user.page}/EntidadesFilantropicas/CadastroNotaEntidadeAviso.aspx`);

    //Pagina do 'prosseguir'
    driver.wait(until.elementLocated(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')));
    driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnOk"]')).click();

    //escolhendo entidade
    driver.wait(until.elementLocated(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')));
    driver.findElement(By.xpath('//*[@id="ddlEntidadeFilantropica"]/option[2]')).click();
    driver.findElement(By.xpath('//*[@id="ctl00_ConteudoPagina_btnNovaNota"]')).click();

    //Pagina de cadastro - confirmar 'DIV'
    driver.wait(until.elementLocated(By.xpath('//*[@id="lblPerguntaMaster"]')))
      .sendKeys(Key.ESCAPE)
      .then(() => resolve(driver));
  });
};

/**
 * @desc Screenshot do Captcha
 * @param {object} driver
 * @return {Promise}
 */
const captcha = (driver) => {

  return new Promise((resolve, reject) => {

    driver.findElement(By.xpath('//*[@id="captchaNFP"]'))
      .then(() => driver.takeScreenshot())
      .then((captcha) => resolve({driver, captcha}))/* Imagem do Captcha */
      .catch((err) => reject(driver)); /* Não Exite Captcha */
  });
}

/**
 * @desc Limpa campos de cadastro
 * @param {object} driver
 * @return {Promise}
 */
const clearFields = (driver) => {

  return new Promise((resolve, reject) => {

    // Limpa Captcha
    driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).clear().catch(err =>{});

    // Limpa Cupom
    driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).clear()// CNPJ
      .then(driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).clear())//  DATA
      .then(driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).clear())//  COO
      .then(driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).clear())//  VALOR
      .then(driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(Key.BACK_SPACE))
      .then(() => resolve(driver)) /* CUPOM LIMPO */

      // Limpa Chave
      .catch(driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).clear())
      .then(driver.findElement(By.xpath('//*[@id="divDocComChave"]/fieldset/input')).sendKeys(Key.BACK_SPACE))
      .then(() => resolve(driver));
  });
};

/**
 * @desc Salva Cupom/Chave
 * @param {object} driver
 * @return {Promise}
 */
const save = (driver) => {

  return new Promise((resolve, reject) => {

    driver.findElement(By.xpath('//*[@id="btnSalvarNota"]')).sendKeys(Key.ENTER)
      .then(driver.findElement(By.xpath('//*[@id="lblErroMaster"]')).getText())
      .then((innerHTML) => reject(innerHTML)) // Erro DIV
      .then(driver.findElement(By.xpath('/html/body/div[3]/div[11]/div/button/span')).click())
      .catch(  driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
      .catch(driver.findElement(By.xpath('//*[@id="lblErro"]')).getText())
      .then((innerHTML) => reject(innerHTML)) // Erro sem DIV
      .catch(() => resolve(driver)) // Sucesso no Cadastro
      .then(clearFields(driver));
  });
};

/**
 * @desc Inseri dados em formulario de Cupom
 * @param {object} driver
 * @param {object} coupon
 * @return {Promise}
 */
 const registerCoupon = (driver, coupon) => {

   return new Promise((resolve, reject) => {

     coupon.data = coupon.data.format('dd/MM/YYYY');

     //Carregamento Formulario
     driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
      .then(driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch((err) => {}))
      .then(() => {

        // Preenche Formulario
        driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(coupon.cnpj);// CNPJ
        driver.findElement(By.xpath('//*[@id="divtxtDtNota"]/input')).sendKeys(coupon.date);//           DATA
        driver.findElement(By.xpath('//*[@id="divtxtNrNota"]/input')).sendKeys(coupon.coo);//            COO
        driver.findElement(By.xpath('//*[@id="divtxtVlNota"]/input')).sendKeys(coupon.total);//          TOTAL
        driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(coupon.captcha).catch((err) => {});//CAPTCHA

        // Salva Cupom
        save(driver).then(() => resolve(coupon));
      });
   });
 };

/**
* @desc Inseri dados em formulario de Chave
* @param {object} driver
* @param {object} qrcode
* @return {Promise}
*/
const registerQRCode = (driver, qrcode) => {

  return new Promise((resolve, reject) => {

    //Carregamento Formulario
    driver.wait(until.elementLocated(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')))
     .then(driver.wait(until.elementLocated(By.xpath('Weird')), 100).catch((err) => {}))
     .then(() => {

       // Preenche Formulario
       driver.findElement(By.xpath('//*[@id="divCNPJEstabelecimento"]/input')).sendKeys(qrcode.value);//CHAVE
       driver.findElement(By.xpath('//*[@id="divCaptcha"]/input')).sendKeys(qrcode.captcha).catch((err) => {});//CAPTCHA

       // Salva Cupom
       save(driver).then(() => resolve(qrcode));
    });
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
