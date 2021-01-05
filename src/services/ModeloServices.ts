import { IModelo } from "../models/Modelo";
import validacao from "../util/validacao";
import Modelo from "../models/Modelo";
import servicoValidacao from "./servicoValidacao";

export default class ModeloService {

  validarModeloASerIncluido(informacoesDoModelo: IModelo) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoModelo.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(informacoesDoModelo.marca));
    return mensagens
  }

  validarModeloASerAlterado(informacoesDoModelo: IModelo) {
    const mensagens: string[] = [];
    mensagens.push(...this.validarModeloASerIncluido(informacoesDoModelo));
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoModelo._id));
    return mensagens
  }

  validarInformacoesDaConsulta(informacoes: any) {
    const mensagens = [];
    !validacao.validarNumero(informacoes.tipo) && mensagens.push("Tipo da busca é obrigatório.")
      || !(informacoes.tipo === "0" || informacoes.tipo === "1") && mensagens.push("Tipo da busca inválido.")
    return mensagens;
  }

  async incluirModelo(informacoesDoModelo: IModelo) {
    return await Modelo
      .create(informacoesDoModelo);
  }

  async contarPorDescricaoDoModeloEIdOficina(informacoesDoModelo: IModelo) {
    return await Modelo
      .countDocuments({
        descricao: informacoesDoModelo.descricao,
        idMarca: informacoesDoModelo.marca,
        idOficina: informacoesDoModelo.oficina
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

  async listarPorIdModeloEIdOficina(oficina: string, _id: string) {
    return await Modelo
      .findOne({
        oficina,
        _id,
      });
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

  async alterarModelo(informacoesDoModelo: IModelo) {
    return await Modelo
      .updateOne(
        {
          _id: informacoesDoModelo._id,
        },
        {
          $set: informacoesDoModelo
        }
      );
  }
}