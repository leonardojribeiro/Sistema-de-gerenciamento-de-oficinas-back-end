const mongoose = require('mongoose');
const Especialidade = require('./Especialidade');

const Funcionario = new mongoose.Schema({
    nome: String,
    cpf: {type:String, unique:true},
    especialidade: [{type: mongoose.Schema.Types.ObjectId, ref: 'Especialidade'}],
});

module.exports = mongoose.model('Funcionario', Funcionario);