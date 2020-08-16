import { Schema, model, Document } from 'mongoose';
import { IOficina } from './Oficina';

export interface IUsuario extends Document{
  nomeUsuario: string;
  senha: string;
  perfil: number;
  idOficina: IOficina['_id'];
}

const usuario = new Schema({
  nomeUsuario: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  perfil: {
    type: Number,
    required: true,
  },
  idOficina:{
    type: Schema.Types.ObjectId, 
    ref: 'Oficina',
    required: true,
  }
});

export default model<IUsuario>('Usuario', usuario);