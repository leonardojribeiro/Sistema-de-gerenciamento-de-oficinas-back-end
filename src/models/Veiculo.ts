import mongoose, { Document } from 'mongoose';
import {IModelo} from './Modelo';
import { IOficina } from './Oficina';

export interface IVeiculo extends Document{
  placa: string;
  anoFabricacao: Date;
  anoModelo: Date;
  modelo: IModelo['_id'];
  oficina: IOficina['_id'];
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
  modelo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true,
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'oficina',
    required: true,
    select: false,
  }
});

export default mongoose.model<IVeiculo>('Veiculo', veiculo);