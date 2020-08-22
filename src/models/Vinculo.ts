import mongoose, { Document } from "mongoose";
import { ICliente } from "./Cliente";
import { IOficina } from "./Oficina";
import { IVeiculo } from "./Veiculo";

export interface IVinculo extends Document{
  vinculoInicial: Date;
  vinculoFinal?: Date;
  veiculo: IVeiculo['_id'];
  cliente: ICliente['_id'];
  oficina: IOficina['_id'];
}

const vinculo = new mongoose.Schema({
  vinculoInicial:{
    type: Date,
    required: true,
  }, 
  vinculoFinal: {
    type: Date,
  },
  veiculo:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Veiculo"
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente"
  },
  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Oficina"
  }
});

export default mongoose.model<IVinculo>("Vinculo", vinculo);