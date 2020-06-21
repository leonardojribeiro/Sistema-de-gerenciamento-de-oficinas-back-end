const mongoose = require('mongoose');

const marca = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  uriLogo: String,
  idOficina: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Oficina",
    required: true
  }
});


module.exports = mongoose.model('Marca', marca);