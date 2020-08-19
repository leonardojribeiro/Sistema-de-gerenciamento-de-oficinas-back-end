import mongoose from 'mongoose';
import { IServico } from './Servico';
import { IFuncionario } from './Funcionario';

export interface IItemDeServico{
  idServico: IServico['_id'];
  idFuncionario: IFuncionario['_id'];
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