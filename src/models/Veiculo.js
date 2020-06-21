const mongoose = require('mongoose');

const veiculo = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
  },
  anoFabricacao: {
    type: Date,
    required: true,
  },
  anoModelo: {
    type: Date,
    required: true,
  },
  idModelo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true,
  }
});

module.exports = mongoose.model('Veiculo', veiculo);