# API DOE Educandario

## Objetivo
  Cadastra cupons fiscais e qrcodes enviados por um [aplicativo mobile](https://github.com/EducandarioBezerradeMenezes/Aplicativo_Cupom_Client) e insere estes cupons no site da receita, tambem alimenta um site cliente que administra as inserções no site da receita.

## Rotas
  As rotas deste servidor estão documentadas dentro de [`_doc/API.json`](./_doc/API.json) para sua visualização e teste basta importar o arquivo dentro de um [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).

## Como Utilizar

### Pré-Instalação
  1. Instale [Node](https://nodejs.org/en/) e [NPM](https://nodejs.org/en/);
  2. Instale [Git](https://git-scm.com/downloads);

### Instalação
  1. Clone este projeto: `git clone https://github.com/Mateus-Oli/doe-educandario-api`;
  2. Instale suas dependencias: `npm install`;
  3. Ou instale apenas as dependencias de produção com: `npm install --production`;

### Configurações
  1. Altere o que necessario relacionado as configurações do projeto no arquivo [`./config.js`](./config.js);

### Ambiente
  1. Rode os comandos a seguir seguidos de `production` para inicializar em módo de produção;
  2. Rode sem a flag `production` para o sistema ser inicializado em modo de desenvolvimento;

### Banco de Dados
  1. Configure o Banco caso ainda não esteja configurado: `npm run migration`;
  2. Alimente o banco com dados padrões para teste: `npm run seed`;

### Inicialização
  1. Inicialize o servidor com: `npm start`.
