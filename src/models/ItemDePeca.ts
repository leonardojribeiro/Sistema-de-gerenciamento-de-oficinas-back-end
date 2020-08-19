import mongoose, { Document } from 'mongoose';
import { IPeca } from './Peca';
import { IFornecedor } from './Fornecedor';

export interface IItemDePeca extends Document{
  idPeca: IPeca['_id'];
  idFornecedor: IFornecedor['_id'];
  unidadeDeGarantia: string;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
}

const ItemDePeca = new mongoose.Schema({
  idPeca: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Peca",
  },
  idFornecedor: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Fornecedor",
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

export default ItemDePeca;