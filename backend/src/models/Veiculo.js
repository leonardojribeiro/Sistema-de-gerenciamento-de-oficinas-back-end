const mongoose = require('mongoose');

const Veiculo = new mongoose.Schema({
    placa: {
        type: String,
        unique: true,
    },
    modelo:{type: mongoose.Schema.Types.ObjectId, ref: 'Modelo'}
});

module.exports = mongoose.model('Veiculo', Veiculo);