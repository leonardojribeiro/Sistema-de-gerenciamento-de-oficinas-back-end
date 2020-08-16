import mongoose, { Document } from "mongoose";
import { ICliente } from "./Cliente";
import { IOficina } from "./Oficina";
import { IVeiculo } from "./Veiculo";

export interface IVinculo extends Document{
  vinculoInicial: Date;
  vinculoFinal?: Date;
  idVeiculo: IVeiculo['_id'];
  idCliente: ICliente['_id'];
  idOficina: IOficina['_id'];
}

const vinculo = new mongoose.Schema({
  vinculoInicial:{
    type: Date,
    required: true,
  }, 
  vinculoFinal: {
    type: Date,
  },
  idVeiculo:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Veiculo"
  },
  idCliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente"
  },
  idOficina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Oficina"
  }
});

export default mongoose.model<IVinculo>("Vinculo", vinculo);