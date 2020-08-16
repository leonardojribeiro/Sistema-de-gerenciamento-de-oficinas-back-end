import { Document } from "mongoose";
import { IEndereco } from "./Endereco";

const mongoose = require("mongoose");
const Endereco = require("./Endereco");
const Ponto = require("./Ponto");

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

const oficina = mongoose.Schema({
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
    required: true,
  },
  statusOficina: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Oficina', oficina);