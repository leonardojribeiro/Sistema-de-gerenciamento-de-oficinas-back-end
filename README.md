# Sistema de Gerenciamento de oficinas - Back-end

Tabela de conteúdos
=================
<!--ts-->
   * [Sobre](#Sobre)
   * [Status](#Status)
   * [Scripts disponíveis](#Scripts-disponíveis)
      * [Executar em modo de desenvolvimento](#yarn-dev)
      * [Compilar para o modo de produção](#yarn-build)
      * [Executar em modo de produção](#yarn-start)
   * [Recursos](#recursos)
<!--te-->

## Status

#### :construction:  Em construção  :construction:

## Sobre

Esse projeto está sendo desenvolvido como requisito parcial de avaliação do trabalho de conclusão de curso de Sistemas de Informação da [Universidade Estadual de Goiás - Unidade de Itaberaí](http://www.itaberai.ueg.br/).<br/>
Tendo como principal objetivo auxiliar no cotidiano das oficinas automobilísticas.

## Requerimentos
Para executar esse projeto é necessário que você tenha algumas ferramentas instaladas no seu dispositivo.
### Node.js
O download do Node está disponível [aqui](https://nodejs.org/pt-br/download/).
Após o download e instalação do Node.js, abra console do seu dispositivo e verifique se a instalação foi bem sucedida através do comando:
> node -v 

Deve aparecer a versão do Node.js que foi instalada.
### Yarn
Após instalar o Node.js, é necessário instalar o yarn, que é o gerenciador de pacotes do Facebook. Essa instalação é feita através do NPM, que por padrão é instalado junto com o Node.js.
> npm install -g yarn

### Visual Studio Code
O Visual Studio Code é o editor de código recomendável para esse projeto. Você pode fazer o download do Visual Studio Code [aqui](https://code.visualstudio.com/).

## Execução 
### Fazer o Download desse projeto
Você pode utilizar o git no diretório desejado para clonar o projeto através do comando:
>git clone https://github.com/LeonardoJRibeiro/Sistema-de-gerenciamento-de-oficinas-back-end.git

Ou você pode fazer o download do projeto zipado e descompactar no diretório desejado.

### Abrir o projeto no Visual Studio Code
1. Abra o Visual Studio Code
2. Navegue até o menu "File"
3. Clique na opçao "Open Folder"
4. Selecione a pasta "Sistema-de-gerenciamento-de-oficinas-back-end" no diretório onde você clonou ou descompactou o projeto.
5. Abra o terminal integrado do Visual.
### Instalação das dependências
Instale as dependências através do comando 
> yarn install

no terminal integrado do Visual Studio Code. <br/>
### Definição das variáveis de ambiente
O arquivo .env fornece algumas variáveis que são fundamentais para o funcionamento do servidor, bem como a conexão com o banco de dados e o armazenamento de imagens.
são elas:

>MONGO_URL

Uma string de conexão com o MongoDB. Você pode criar uma conexão a partir de uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

>APP_SECRET

Uma palavra secreta de 32 caracteres utilizada na criptografia.

>APP_SECRET_IV

Outra palavra secreta de 16 caracteres também utilizada na criptografia.

>STORAGE_TYPE = local

Define o tipo de armazenamento de imagens. Valores possíveis: "local" e "googleStorage" sem aspas.

>GCLOUD_STORAGE_BUCKET

Nome do bucket do Google Storage. (caso o STORAGE_TYPE seja local, pode ficar em branco)

>GCLOUD_STORAGE_PROJECT_ID

Id do projeto em que o bucket está instanciado. (caso o STORAGE_TYPE seja local, pode ficar em branco)

>GCLOUD_STORAGE_KEY_FILE_NAME

Caminho absoluto até o arquivo chave do Google Storage. (caso o STORAGE_TYPE seja local, pode ficar em branco)

>DESENVOLVIMENTO

Caso o Google Storage esteja sendo utilizado em modo de desenvolvimento.

>JWT_DURATION 

O tempo de duração do token JWT.

O arquivo .envExample já possui essas variáveis definidas para a utilização mas é conveniente alterá-las, é necessário alterar seu nome para ".env".

## Scripts disponíveis

No diretório do projeto, você pode executar:

### `yarn dev`

O app será executado em modo de desenvolvimento.<br />
Acesse [http://localhost:3333](http://localhost:3333) para visualizá-lo.

### `yarn build`

Compila o app para o modo de produção para o diretório `dist`.<br />
O app estará pronto para o deploy.

### `yarn start`

O app será executado em modo de produção.<br />

## Tecnologias

  * NodeJS
  * Mongoose
  * JWT

## Recursos 
  - [X] Marcas
    - [x] Cadastro de Marcas
    - [x] Alteração de Marcas
    - [x] Listagem de Marcas
    - [x] Consulta de Marcas
  - [X] Modelos
    - [x] Cadastro de Modelos
    - [x] Alteração de Modelos
    - [x] Listagem de Modelos
    - [x] Consulta de Modelos
  - [X] Peças
    - [x] Cadastro de Peças
    - [x] Alteração de Peças
    - [x] Listagem de Peças
    - [X] Consulta de Peças
  - [X] Clientes
    - [x] Cadastro de Clientes
    - [x] Alteração de Clientes
    - [x] Listagem de Clientes
    - [X] Consulta de Clientes
    - [X] Consulta de veículos de Clientes
  - [X] Veículos
    - [x] Cadastro de Veículos
    - [x] Alteração de Veículos
    - [x] Listagem de Veículos
    - [X] Consulta de Veículos
  - [X] Fornecedores
    - [x] Cadastro de Fornecedores
    - [x] Alteração de Fornecedores
    - [x] Listagem de Fornecedores
    - [X] Consulta de Fornecedores
  - [X] Especialidades
    - [x] Cadastro de Especialidades
    - [x] Alteração de Especialidades
    - [x] Listagem de Especialidades
    - [X] Consulta de Especialidades
  - [X] Funcionários
    - [X] Cadastro de Funcionários
    - [X] Alteração de Funcionários
    - [X] Listagem de Funcionários
    - [X] Consulta de Funcionários
  - [X] Serviços
    - [X] Cadastro de Serviços
    - [X] Alteração de Serviços
    - [X] Listagem de Serviços
    - [X] Consulta de Serviços
  - [X] Ordens de Serviço
    - [X] Cadastro de Ordens de Serviço
    - [X] Alteração de Ordens de Serviço
    - [X] Listagem de Ordens de Serviço
    - [X] Consulta de Ordens de Serviço
  - [ ] Usuarios
    - [X] Login
    - [ ] Cadastro de Usuários
    - [ ] Alteração de Usuários
    - [ ] Listagem de Usuários
    - [ ] Consulta de Usuários 
  - [ ] Oficinas
    - [ ] Cadastro de Oficinas Candidatas
    - [ ] Cadastro de Oficinas
    - [ ] Alteração de Oficinas
    - [ ] Listagem de Oficinas
    - [ ] Consulta de Oficinas