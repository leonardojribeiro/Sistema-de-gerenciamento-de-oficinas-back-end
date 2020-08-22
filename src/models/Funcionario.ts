import mongoose, { Document } from 'mongoose';
import especialidade, { IEspecialidade } from './Especialidade';
import Endereco, { IEndereco } from './Endereco';
import { IOficina } from './Oficina';

export interface IFuncionario extends Document{
  nome: string;
  dataNascimento: Date;
  sexo: string;
  cpf: string;
  telefoneCelular: string;
  telefoneFixo: string;
  email: string;
  endereco: IEndereco;
  oficina: IOficina['_id'];
  especialidades: IEspecialidade['_id'][];
}

const funcionario = new mongoose.Schema({
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
  cpf: {
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
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina",
    required: true,
    select: false,
  },
  especialidades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Especialidade'
    }
  ],
});

export default mongoose.model<IFuncionario>('Funcionario', funcionario);