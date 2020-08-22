import mongoose, { Document } from 'mongoose';
import { IOficina } from './Oficina';

export interface IMarca extends Document{
  descricao: string;
  uriLogo: string;
  oficina: IOficina['_id'];
}

export const marca = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  uriLogo: String,
  oficina: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Oficina",
    required: true,
    select: false,
  }
});

export default mongoose.model<IMarca>('Marca', marca);