import mongoose, { Document } from 'mongoose';
import { IOficina } from './Oficina';

export interface IEspecialidade extends Document{
  descricao: string;
  oficina: IOficina['_id'];
}

const especialidade = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  }
});

export default mongoose.model<IEspecialidade>('Especialidade', especialidade);