const mongoose = require('mongoose');

const Modelo = new mongoose.Schema({
    descricao: {
        type: String,
        unique: true,
    },
    marca:{type: mongoose.Schema.Types.ObjectId, ref: 'Marca'}
});

module.exports = mongoose.model('Modelo', Modelo);