const mongoose = require("mongoose");
const Endereco = require("./Endereco");
const Ponto = require("./Ponto");

const oficina = mongoose.Schema({
  nomeFantasia: {
    type: String,
    required: true,
  },
  razaoSocial: {
    type: String,
  },
  cpfCnpj:{
    type: String,
    unique: true,
    required: true,
  },
  telefoneFixo: String,
  telefoneCelular: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    unique: true,
    required: true,
  },
  uriLogo: String,
  webSite: String,
  endereco: {
    type: Endereco,
    required: true,
  },
  localizacao: {
    type: Ponto,
    index: '2dsphere',
    required: true,
  },
  statusOficina: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Oficina', oficina);