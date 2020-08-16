import mongoose, { Document } from "mongoose";

export interface IEndereco extends Document{
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  complemento: string;
  cidade: string;
  estado: string;
}

const endereco = new mongoose.Schema({
  logradouro: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  cep:{
    type: String,
    required: true,
  },
  complemento: {
    type: String,
  },
  cidade: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  }
})

export default endereco;