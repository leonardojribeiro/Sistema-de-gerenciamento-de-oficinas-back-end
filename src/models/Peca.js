const mongoose = require("mongoose")

const Peca = new mongoose.Schema({
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
})

module.exports = mongoose.model("Peca", Peca);