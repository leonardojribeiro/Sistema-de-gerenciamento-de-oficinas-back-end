import mongoose, { Document } from 'mongoose';


export const publicacoes = new mongoose.Schema({
  autor: {
    type: String,
    required: true,
  },
  
  oficina: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Oficina",
    required: true,
    select: false,
  }
});

export default mongoose.model('Marca', );