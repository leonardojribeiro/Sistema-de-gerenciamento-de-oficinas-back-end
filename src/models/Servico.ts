import mongoose, { Document } from "mongoose";
import { IOficina } from "./Oficina";

export interface IServico extends Document{
  descricao: string;
  tempoDuracao: number;
  valor: number;
  oficina: IOficina['_id'];
}

const servico = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  tempoDuracao: {
    type: Number,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
    select: false,
  }
});

export default mongoose.model<IServico>("Servico", servico);