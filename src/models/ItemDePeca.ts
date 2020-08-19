import mongoose from 'mongoose';
import { IPeca } from './Peca';
import { IFornecedor } from './Fornecedor';

export interface IItemDePeca {
  idPeca: IPeca['_id'];
  idFornecedor: IFornecedor['_id'];
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