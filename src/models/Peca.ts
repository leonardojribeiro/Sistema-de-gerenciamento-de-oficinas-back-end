import mongoose, { Document } from "mongoose";
import { IMarca } from "./Marca";
import { IOficina } from "./Oficina";

export interface IPeca extends Document {
  descricao: string;
  marca: IMarca['_id'];
  oficina: IOficina['_id'];
}

const peca = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marca',
    required: true,
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: true,
    select: false,
  }
})

export default mongoose.model<IPeca>("Peca", peca);