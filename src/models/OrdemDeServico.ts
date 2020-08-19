import mongoose, { Document } from "mongoose";
import ItemDeServico, { IItemDeServico } from "./ItemDeServico";
import ItemDePeca, { IItemDePeca } from "./ItemDePeca";
import { IVeiculo } from "./Veiculo";
import { IOficina } from "./Oficina";

export interface IOrdemDeServico extends Document {
  dataDeRegistro: Date;
  dataDeInicio: Date;
  dataDeConclusao: Date;
  andamento: number;
  valorTotalDosServicos: number;
  valorTotalDasPecas: number;
  desconto: number;
  valorTotal: number;
  categoria: string;
  status: string;
  sintoma: string;
  itensDeServico: IItemDeServico[];
  itensDePeca: IItemDePeca[];
  idVeiculo: IVeiculo['_id'];
  idOficina: IOficina['_id'];
}

const ordemDeServico = new mongoose.Schema({
  dataDeRegistro: {
    type: Date,
    required: true,
  },
  dataDeInicio: {
    type: Date,
    required: true,
  },
  dataDeConclusao: {
    type: Date,
    required: true,
  },
  andamento: {
    type: Number,
    required: true,
  },
  valorTotalDosServicos: {
    type: Number,
    required: true,
  },
  valorTotalDasPecas: {
    type: Number,
    required: true,
  },
  desconto: {
    type: Number,
    required: true,
  },
  valorTotal: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  sintoma: {
    type: String,
    required: true,
  },
  itensDeServico: {
    type: [ItemDeServico],
    required: true,
  },
  itensDePeca: {
    type: [ItemDePeca],
    required: true,
  },
  idVeiculo: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Veiculo",
  },
  idOficina: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Oficina",
  }
});


export default mongoose.model<IOrdemDeServico>("OrdemDeServico", ordemDeServico)