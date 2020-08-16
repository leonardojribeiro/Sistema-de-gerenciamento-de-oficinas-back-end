import Marca, { IMarca } from "../models/Marca";
import validacao from "../util/validacao";
import GoogleStorage from "../util/GoogleStorage";
import crypto from "crypto";

export default class MarcaServices {
  async apagarLogomarca(uriLogomarca: string) {
    await GoogleStorage.apagar(uriLogomarca);
  }

  validarMarcaASerInserida(marca: IMarca) {
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

  async inserir(marca: IMarca) {
    return await Marca
      .create(marca);
  }

  async contarPorDescricaoEIdOficina(marca: IMarca) {
    return await Marca
      .countDocuments({
        descricao: marca.descricao,
        idOficina: marca.idOficina,
      });
  }

  async listarPorIdOficina(idOficina: string) {
    return await Marca
      .find({
        idOficina
      })
      .select({
        __v: 0,
        idOficina: 0
      });
  }

  async listarPorIdMarcaEIdOficina(marca: IMarca) {
    return await Marca
      .findOne(marca)
      .select({
        __v: 0,
        idOficina: 0
      });
  }

  async listarPorDescricaoParcialEIdOficina(marca: IMarca) {
    return await Marca
      .find({
        descricao: {
          $regex: marca.descricao,
          $options: "i",
        },
        idOficina: marca.idOficina,
      })
      .select({
        __v: 0,
        idOficina: 0,
      });
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