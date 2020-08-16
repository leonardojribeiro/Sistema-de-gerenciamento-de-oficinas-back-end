import mongoose, { Document } from "mongoose";
import Endereco, { IEndereco } from "./Endereco";
import { IOficina } from "./Oficina";

export interface IFornecedor extends Document{
  nomeFantasia: string;
  razaoSocial: string;
  cpfCnpj: string;
  telefoneFixo: string;
  telefoneCelular: string;
  email: string;
  endereco: IEndereco;
  idOficina: IOficina['_id'];
}

const fornecedor = new mongoose.Schema({
  nomeFantasia: {
    type: String,
    required: true,
  },
  razaoSocial: {
    type: String,
  },
  cpfCnpj:{
    type: String,
    unique: true,
    required: true,
  },
  telefoneFixo: String,
  telefoneCelular: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    unique: true,
  },
  endereco: {
    type: Endereco,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

export default mongoose.model<IFornecedor>("Fornecedor", fornecedor);