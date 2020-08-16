const mongoose = require("mongoose");

const servico = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  tempoDuracao: {
    type: Date,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  }
});

module.exports = mongoose.model("Servico", servico);