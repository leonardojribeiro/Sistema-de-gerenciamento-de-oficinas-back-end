import { IModelo } from "../models/Modelo";

import validacao from "../util/validacao";
import Modelo from "../models/Modelo";
import { Types } from "mongoose";
import servicoValidacao from "./servicoValidacao";

const selecaoCampos = {
  idMarca: 0,
  oficina: 0,
  __v: 0,
  "marca.oficina": 0,
  "marca.__v": 0
};

const agregacao = {
  from: "marcas",
  localField: "marca",
  foreignField: "_id",
  as: "marca",
};

export default class ModeloService {

  validarModeloASerInserido(modelo: IModelo) {
    const mensagens: string[] = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(modelo.marca));
    return mensagens
  }

  validarModeloASerAlterado(modelo: IModelo) {
    const mensagens: string[] = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(modelo.marca));
    return mensagens
  }

  validarInformacoesDaConsulta(informacoes: any) {
    const mensagens = [];
    !validacao.validarNumero(informacoes.tipo) && mensagens.push("Tipo da busca é obrigatório.")
      || !(informacoes.tipo === "0" || informacoes.tipo === "1") && mensagens.push("Tipo da busca inválido.")
    return mensagens;
  }

  async inserir(modelo: IModelo) {
    return await Modelo
      .create(modelo);
  }

  async contarPorDescricaoDoModeloEIdOficina(modelo: IModelo) {
    return await Modelo
      .countDocuments({
        descricao: modelo.descricao,
        idMarca: modelo.marca,
        idOficina: modelo.oficina
      });
  }

  async listarPorIdOficina(oficina: string) {
    return await Modelo
      .aggregate()
      .lookup(agregacao)
      .match({
        oficina: Types.ObjectId(oficina)
      })
      .unwind("marca")
      .project(selecaoCampos);
  }

  async listarPorIdModeloEIdOficina(modelo: IModelo) {
    return await Modelo
      .findOne(modelo);
  }

  async consultar(consulta: any) {
    let match;
    switch (consulta.tipo) {
      case "0": {
        match = {
          descricao: {
            $regex: consulta.consulta,
            $options: "i",
          },
          oficina: Types.ObjectId(consulta.oficina)
        };
        break;
      }
      case "1": {
        match = {
          "marca.descricao": {
            $regex: consulta.consulta,
            $options: "i",
          },
          oficina: Types.ObjectId(consulta.oficina)
        };
        break;
      }
    }
    return await Modelo
      .aggregate()
      .lookup(agregacao)
      .match(match)
      .unwind("marca")
      .project(selecaoCampos);
  }

  async alterarModelo(modelo: IModelo) {
    return await Modelo
      .updateOne(
        {
          _id: modelo._id,
        },
        {
          $set: modelo
        }
      );
  }
}