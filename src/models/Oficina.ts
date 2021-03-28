import { IEndereco } from "./Endereco";
import mongoose, { Document } from "mongoose";
import Endereco from "./Endereco";
import Ponto from "./Ponto";

export interface IOficina extends Document{
  nomeFantasia: string;
  razaoSocial: string;
  cpfCnpj: string;
  telefoneFixo: string;
  telefoneCelular: string;
  email: string;
  uriLogo: string;
  webSite: string;
  endereco: IEndereco;
  localizacao: any;
  statusOficina: string;
}

const oficina = new mongoose.Schema({
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
    required: true,
  },
  uriLogo: String,
  webSite: String,
  endereco: {
    type: Endereco,
    required: true,
  },
  localizacao: {
    type: Ponto,
    index: '2dsphere',
  },
  statusOficina: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Oficina', oficina);