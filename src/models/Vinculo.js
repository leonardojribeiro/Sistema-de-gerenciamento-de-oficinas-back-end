const mongoose = require("mongoose");

const vinculo = new mongoose.Schema({
  vinculoInicial:{
    type: Date,
    required: true,
  }, 
  vinculoFinal: {
    type: Date,
  },
  idVeiculo:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Veiculo"
  },
  idCliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente"
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Oficina"
  }
});

module.exports = mongoose.model("Vinculo", vinculo);