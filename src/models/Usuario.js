const mongoose = require('mongoose');

const usuario = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  perfil: {
    type: String,
    required: true,
  },
  idOficina:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Oficina',
    required: true,
  }
});

module.exports = mongoose.model('Usuario', usuario);