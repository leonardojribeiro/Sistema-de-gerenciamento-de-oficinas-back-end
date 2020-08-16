import mongoose, { Document } from 'mongoose';
import { IOficina } from './Oficina';

export interface IMarca extends Document{
  descricao: string;
  uriLogo: string;
  idOficina: IOficina['_id'];
}

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

export default mongoose.model<IMarca>('Marca', marca);