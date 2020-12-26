import Marca, { IMarca } from "../models/Marca";
import validacao from "../util/validacao";
import GoogleStorage from "../util/GoogleStorage";
import crypto from "crypto";

export default class MarcaServices {
  async apagarLogomarca(uriLogomarca: string) {
    await GoogleStorage.apagar(uriLogomarca);
  }

  validarMarcaASerIncluida(marca: IMarca) {
    const mensagens: string[] = [];
    !validacao.validarTexto(marca.descricao) && mensagens.push("Descrição é obrigatório.");
    return mensagens;
  }

  validarMarcaASerAlterada(marca: IMarca) {
    const mensagens: string[] = [];
    !validacao.validarTexto(marca._id) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(marca._id) && mensagens.push("Id da marca inválido.");
    !validacao.validarTexto(marca.descricao) && mensagens.push("Descrição é obrigatório.");
    return mensagens;
  }

  async fazerUploadDaLogomarca(file: any) {
    try {
      const nome = `${crypto.randomBytes(16).toString("hex")}.${file.mimetype.split("/")[1]}`;
      const upload = await GoogleStorage.salvar(nome, file.buffer);
      return nome;
    }
    catch (erro) {
      throw erro;
    }
  }

  async incluirMarca(marca: IMarca) {
    return await Marca
      .create(marca);
  }

  async contarPorDescricaoEIdOficina(marca: IMarca) {
    return await Marca
      .countDocuments({
        descricao: marca.descricao,
        idOficina: marca.oficina,
      });
  }

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
  }

  async contarPorOficina(oficina: string,) {
    return await Marca
      .countDocuments({
        oficina,
      })
  }


  async listarPorIdMarcaEIdOficina(marca: IMarca) {
    return await Marca
      .findOne(marca)
      .select({
        __v: 0,
        oficina: 0
      });
  }

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
  }

  async contarPorConsulta(oficina: string, descricao: string) {
    return await Marca
      .countDocuments({
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        },
        oficina,
      })
  }

  async alterarMarca(marca: IMarca) {
    return await Marca
      .updateOne(
        {
          _id: marca._id,
        },
        {
          $set: marca
        }
      );
  }
}