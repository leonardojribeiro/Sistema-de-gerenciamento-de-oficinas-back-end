import validacao from "../util/validacao";
import Peca, { IPeca } from "../models/Peca";
import { Types } from "mongoose";
import servicoValidacao from "./servicoValidacao";
import Marca from "../models/Marca";

const selecaoCampos = {

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

  validarPecaASerInserida(peca: IPeca) {
    const mensagens = [];
    !validacao.validarTexto(peca.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(peca.marca));
    return mensagens
  }

  validarPecaASerAlterada(peca: IPeca) {
    const mensagens: string[] = [];
    !validacao.validarTexto(peca.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(peca.marca));
    return mensagens
  }

  async inserir(peca: IPeca) {
    return await Peca
      .create(peca);
  }

  async contarPorDescricaoDaPecaIdMarcaEIdOficina(peca: IPeca) {
    return await Peca
      .countDocuments({
        descricao: peca.descricao,
        marca: peca.marca,
        oficina: peca.oficina
      });
  }

  async contarPorOficina(oficina: string) {
    return await Peca
      .countDocuments({
        oficina
      });
  }

  async listarPorOficina(oficina: string, skip: number, limit: number,) {
    return await Peca
      .find({
        oficina: Types.ObjectId(oficina)
      })
      .populate({
        path: "marca"
      })
      .limit(limit)
      .skip(skip)
  }

  async listarPorIdOficinaEIdPeca(peca: IPeca) {
    return await Peca
      .findOne(peca);
  }



  async consultar(oficina: string, consulta: string, marca: string, skip: number, limit: number,) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: consulta,
          $options: "i",
        },
        marca,
        oficina
      };
    }
    else {
      match = {
        descricao: {
          $regex: consulta,
          $options: "i",
        },
        oficina
      };
    }

    return await Peca
      .find(match)
      .populate({
        path: "marca",
        select: {
          __v: 0
        }
      })
      .skip(skip)
      .limit(limit)
      .select({
        __v: 0,
      })
  }

  async contarPorConsulta(oficina: string, consulta: string, marca: string) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: consulta,
          $options: "i",
        },
        marca,
        oficina
      };
    }
    else {
      match = {
        descricao: {
          $regex: consulta,
          $options: "i",
        },
        oficina
      };
    }
    return await Peca
      .countDocuments(match);
  }

  async alterarPeca(peca: IPeca) {
    return await Peca
      .updateOne(
        {
          _id: peca._id,
        },
        {
          $set: peca
        }
      )
  }

}