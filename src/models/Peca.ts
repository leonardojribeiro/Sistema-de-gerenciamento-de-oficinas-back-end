import mongoose, { Document } from "mongoose";
import { IMarca } from "./Marca";
import { IOficina } from "./Oficina";

export interface IPeca extends Document {
  descricao: string;
  idMarca: IMarca['_id'];
  idOficina: IOficina['_id'];
}

const peca = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  idMarca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marca',
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: true,
  }
})

export default mongoose.model<IPeca>("Peca", peca);