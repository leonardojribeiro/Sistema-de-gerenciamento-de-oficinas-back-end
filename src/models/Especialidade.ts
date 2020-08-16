import mongoose, { Document } from 'mongoose';
import { IOficina } from './Oficina';

export interface IEspecialidade extends Document{
  descricao: string;
  idOficina: IOficina['_id'];
}

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

export default mongoose.model<IEspecialidade>('Especialidade', especialidade);