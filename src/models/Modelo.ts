import mongoose, { Document } from 'mongoose';
import  {IMarca, marca} from './Marca';
import { IOficina } from './Oficina';

export interface IModelo extends Document{
  descricao: string;
  marca: IMarca['_id'];
  oficina: IOficina['_id'];
}

const modelo = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marca",
    required: true,
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: true,
  }
});

export default mongoose.model<IModelo>('Modelo', modelo);