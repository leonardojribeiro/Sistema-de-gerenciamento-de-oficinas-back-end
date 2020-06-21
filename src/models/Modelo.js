const mongoose = require('mongoose');

const modelo = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  idMarca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marca',
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: true,
  }
});

module.exports = mongoose.model('Modelo', modelo);