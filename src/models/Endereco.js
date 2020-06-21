const mongoose = require("mongoose");

const endereco = new mongoose.Schema({
  logradouro: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  cep:{
    type: String,
    required: true,
  },
  complemento: {
    type: String,
  },
  cidade: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  }
})

module.exports = endereco;