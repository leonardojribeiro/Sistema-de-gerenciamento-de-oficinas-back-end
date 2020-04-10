const mongoose = require('mongoose');

const Marca = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true,
    },
    caminhoLogo:String
});

module.exports = mongoose.model('Marca', Marca);