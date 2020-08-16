import mongoose, { Document } from "mongoose";
import Endereco, { IEndereco } from "./Endereco";
import { IOficina } from "./Oficina";

export interface ICliente extends Document {
  nome: string;
  dataNascimento: Date;
  sexo: string;
  cpfCnpj: string;
  telefoneFixo: string;
  telefoneCelular: string;
  email: string;
  endereco: IEndereco;
  idOficina: IOficina['_id'];
}

const cliente = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  sexo: {
    type: String,
  },
  cpfCnpj: {
    type: String,
    required: true,
  },
  telefoneFixo: String,
  telefoneCelular: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  endereco: {
    type: Endereco,
    required: true,
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
  }
});

export default mongoose.model<ICliente>("Cliente", cliente);