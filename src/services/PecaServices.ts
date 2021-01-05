import validacao from "../util/validacao";
import Peca, { IPeca } from "../models/Peca";
import servicoValidacao from "./servicoValidacao";

export default class ModeloService {

  validarPecaASerIncluida(informacoesDaPeca: IPeca) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDaPeca.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(informacoesDaPeca.marca));
    return mensagens
  }

  validarPecaASerAlterada(informacoesDaPeca: IPeca) {
    const mensagens: string[] = [];
    mensagens.push(...this.validarPecaASerIncluida(informacoesDaPeca));
    mensagens.push(...servicoValidacao.validarIdDaPeca(informacoesDaPeca._id));
    return mensagens
  }

  async incluirPeca(informacoesDaPeca: IPeca) {
    return await Peca
      .create(informacoesDaPeca);
  }

  async contarPorDescricaoDaPecaIdMarcaEIdOficina(informacoesDaPeca: IPeca) {
    return await Peca
      .countDocuments({
        descricao: informacoesDaPeca.descricao,
        marca: informacoesDaPeca.marca,
        oficina: informacoesDaPeca.oficina
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
        oficina
      })
      .populate({
        path: "marca"
      })
      .limit(limit)
      .skip(skip)
  }

  async listarPorIdOficinaEIdPeca(oficina: string, _id: string) {
    return await Peca
      .findOne({
        oficina,
        _id
      });
  }

  async consultar(oficina: string, descricao: string, marca: string, skip: number, limit: number,) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        marca,
        oficina
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

  async contarPorConsulta(oficina: string, descricao: string, marca: string) {
    let match;
    if (marca) {
      match = {
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        marca,
        oficina
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
    return await Peca
      .countDocuments(match);
  }

  async alterarPeca(informacoesDaPeca: IPeca) {
    return await Peca
      .updateOne(
        {
          _id: informacoesDaPeca._id,
        },
        {
          $set: informacoesDaPeca
        }
      )
  }

}