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

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Modelo
      .find({ oficina })
      .populate({
        path: "marca",
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorOficina(oficina: string,) {
    return await Modelo
      .countDocuments({
        oficina
      })
  }

  async listarPorIdModeloEIdOficina(modelo: IModelo) {
    return await Modelo
      .findOne(modelo);
  }

  async consultar(oficina: string, descricao: string, marca: string, pular: number, limite: number) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        marca,
        oficina,
      };
    }
    else {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        oficina
      };
    }
    return await Modelo
      .find(match)
      .populate({
        path: "marca"
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorConsulta(oficina: string, descricao: string, marca: string) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        marca,
        oficina,
      };
    }
    else {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        oficina
      };
    }
    return await Modelo
      .countDocuments(match);
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