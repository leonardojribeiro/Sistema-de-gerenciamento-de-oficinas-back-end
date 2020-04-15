const mongoose = require('mongoose');

const Especialidade = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true,
    } 
});

module.exports = mongoose.model('Especialidade', Especialidade);