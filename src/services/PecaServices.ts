import validacao from "../util/validacao";
import Peca, { IPeca } from "../models/Peca";
import { Types } from "mongoose";
import servicoValidacao from "./servicoValidacao";

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

  validarInformacoesDaConsulta(informacoes: any) {
    const mensagens: string[] = [];
    !validacao.validarNumero(informacoes.tipo) && mensagens.push("Tipo da busca é obrigatório.")
      || !(informacoes.tipo === "0" || informacoes.tipo === "1") && mensagens.push("Tipo da busca inválido.")
    return mensagens;
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

  async listarPorIdOficina(oficina: string) {
    return await Peca
      .aggregate()
      .lookup(agregacao)
      .match({
        oficina: Types.ObjectId(oficina)
      })
      .unwind("marca")
      .project(selecaoCampos);
  }

  async listarPorIdOficinaEIdPeca(peca: IPeca) {
    return await Peca
      .findOne(peca);
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
    return await Peca
      .aggregate()
      .lookup(agregacao)
      .match(match)
      .unwind("marca")
      .project(selecaoCampos);
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