const mongoose = require('mongoose');

const especialidade = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  }
});

module.exports = mongoose.model('Especialidade', especialidade);