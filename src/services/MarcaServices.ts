import Marca, { IMarca } from "../models/Marca";
import validacao from "../util/validacao";
import GoogleStorage from "../util/GoogleStorage";
import crypto from "crypto";
import servicoValidacao from "./servicoValidacao";

export default {
  async apagarLogomarca(uriLogomarca: string) {
    await GoogleStorage.apagar(uriLogomarca);
  },

  validarMarcaASerIncluida(informacoesDaMarca: IMarca) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDaMarca.descricao) && mensagens.push("Descrição é obrigatório.");
    return mensagens;
  },

  validarMarcaASerAlterada(informacoesDaMarca: IMarca) {
    const mensagens: string[] = [];
    mensagens.push(...this.validarMarcaASerIncluida(informacoesDaMarca));
    mensagens.push(...servicoValidacao.validarIdDaMarca(informacoesDaMarca._id));
    return mensagens;
  },

  async fazerUploadDaLogomarca(file: any) {
    try {
      const nome = `${crypto.randomBytes(16).toString("hex")}.${file.mimetype.split("/")[1]}`;
      const upload = await GoogleStorage.salvar(nome, file.buffer);
      return nome;
    }
    catch (erro) {
      throw erro;
    }
  },

  async incluirMarca(informacoesDaMarca: IMarca) {
    return await Marca
      .create(informacoesDaMarca);
  },

  async contarPorDescricaoEIdOficina(informacoesDaMarca: IMarca) {
    return await Marca
      .countDocuments({
        descricao: informacoesDaMarca.descricao,
        idOficina: informacoesDaMarca.oficina,
      });
  },

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Marca
      .find({
        oficina
      })
      .skip(pular)
      .limit(limite)
      .select({
        __v: 0,
      });
  },

  async contarPorOficina(oficina: string,) {
    return await Marca
      .countDocuments({
        oficina,
      })
  },

  async listarPorIdMarcaEIdOficina(oficina: string, _id: string) {
    return await Marca
      .findOne({
        oficina,
        _id,
      })
      .select({
        __v: 0,
        oficina: 0
      });
  },

  async consultar(oficina: string, descricao: string, pular: number, limite: number) {
    return await Marca
      .find({
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        oficina,
      })
      .skip(pular)
      .limit(limite)
      .select({
        __v: 0,
      })
  },

  async contarPorConsulta(oficina: string, descricao: string) {
    return await Marca
      .countDocuments({
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        oficina,
      })
  },

  async alterarMarca(informacoesDaMarca: IMarca) {
    return await Marca
      .updateOne(
        {
          _id: informacoesDaMarca._id,
        },
        {
          $set: informacoesDaMarca
        }
      );
  },
}