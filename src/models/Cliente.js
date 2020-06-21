const mongoose = require("mongoose");
const Endereco = require("./Endereco");

const cliente = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  sexo:{
    type: String,
  },
  cpfCnpj:{
    type: String,
    required: true,
  },
  telefoneFixo: String,
  telefoneCelular: {
    type: String,
    required: true,
  },
  email:{
    type: String,
  },
  endereco: {
    type: Endereco,
    required: true,
  },
  idOficina:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  }
});

module.exports = mongoose.model("Cliente", cliente);