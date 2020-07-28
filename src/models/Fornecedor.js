const mongoose = require("mongoose");
const Endereco = require("./Endereco");


const fornecedor = new mongoose.Schema({
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
  },
  endereco: {
    type: Endereco,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = mongoose.model("Fornecedor", fornecedor);