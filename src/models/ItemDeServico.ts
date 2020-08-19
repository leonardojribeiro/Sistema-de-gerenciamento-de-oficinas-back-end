import mongoose, { Document } from 'mongoose';
import { IServico } from './Servico';
import { IFuncionario } from './Funcionario';

export interface IItemDeServico extends Document{
  idServico: IServico['_id'];
  idFuncionario: IFuncionario['_id'];
  garantia: number;
  unidadeDeGarantia: string;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
}

const ItemDeServico = new mongoose.Schema({
  idFuncionario: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Funcionario",
  },
  idServico: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Servico",
  },
  garantia: {
    type: Number,
    required: true,
  },
  unidadeDeGarantia:{
    type: String,
    required: true,
  },
  valorUnitario: {
    type: Number,
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
  },
  valorTotal: {
    type: Number,
    required: true,
  }
});

export default ItemDeServico;