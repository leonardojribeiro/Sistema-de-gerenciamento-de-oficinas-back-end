import mongoose, { Document } from 'mongoose';
import {IModelo} from './Modelo';
import { IOficina } from './Oficina';

export interface IVeiculo extends Document{
  placa: string;
  anoFabricacao: Date;
  anoModelo: Date;
  idModelo: IModelo['_id'];
  idOficina: IOficina['_id'];
}

const veiculo = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
  },
  anoFabricacao: {
    type: Date,
    required: true,
  },
  anoModelo: {
    type: Date,
    required: true,
  },
  idModelo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true,
  }
});

export default mongoose.model<IVeiculo>('Veiculo', veiculo);