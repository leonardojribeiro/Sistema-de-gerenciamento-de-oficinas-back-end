const mongoose = require('mongoose');
const Especialidade = require('./Especialidade');
const Endereco = require('./Endereco');

const funcionario = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  sexo: {
    type: String,
  },
  cpfCnpj: {
    type: String,
    required: true,
  },
  telefoneFixo: String,
  telefoneCelular: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  endereco: {
    type: Endereco,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  },
  especialidade: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Especialidade'
    }
  ],
});

module.exports = mongoose.model('Funcionario', funcionario);