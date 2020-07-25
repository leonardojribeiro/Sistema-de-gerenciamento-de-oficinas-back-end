const Marca = require("../models/Marca");
const validacao = require("../util/validacao");
const { promisify } = require("util");
const GoogleStorage = require("../util/GoogleStorage");

const path = require("path");
const crypto = require("crypto");

module.exports = {

  async apagarLogomarca(uriLogomarca) {
    await GoogleStorage.apagar(uriLogomarca);
  },

  validarMarcaASerInserida(marca) {
    const mensagens = [];
    !validacao.validarTexto(marca.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(marca.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },

  validarIdDaOficina(marca) {
    const mensagens = [];
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(marca.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },

  validarIdDaOficinaEIdDaMarca(marca) {
    const mensagens = [];
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(marca.idOficina) && mensagens.push("Id da oficina inválido.");
    !validacao.validarTexto(marca._id) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(marca._id) && mensagens.push("Id da marca inválido.");
    return mensagens;
  },

  validarMarcaASerAlterada(marca) {
    const mensagens = [];
    !validacao.validarTexto(marca._id) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(marca._id) && mensagens.push("Id da marca inválido.");
    !validacao.validarTexto(marca.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(marca.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },

  async fazerUploadDaLogomarca(file) {
    try {
      const nome = `${crypto.randomBytes(16).toString("hex")}.${file.mimetype.split("/")[1]}`;
      const upload = await GoogleStorage.salvar(nome, file.buffer);
      if (upload) {
        return nome;
      }
      return null;
    }
    catch (erro) {
      console.log(erro)
    }
    return null;
  },

  async inserir(marca) {
    return await Marca
      .create(marca)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorDescricaoEIdOficina(marca) {
    return await Marca
      .countDocuments({
        descricao: marca.descricao,
        idOficina: marca.idOficina,
      })
      .catch(erro => {
        console.log(erro)
      })
  },

  async listarPorIdOficina(idOficina) {
    return await Marca
      .find({
        idOficina
      })
      .select({
        __v:0,
        idOficina: 0
      })
      .catch(erro => {
        console.log(erro)
      });
  },

  async listarPorIdMarcaEIdOficina(marca) {
    return await Marca
      .findOne(marca)
      .select({
        __v:0,
        idOficina: 0
      })
      .catch(erro => {
        console.log(erro)
      });
  },

  async listarPorDescricaoParcialEIdOficina(marca) {
    return await Marca
      .find({
        descricao: {
          $regex: marca.descricao,
          $options: "i",
        },
        idOficina: marca.idOficina,
      })
      .select({
        __v:0,
        idOficina: 0,
      })
      .catch(erro => {
        console.log(erro);
      });
  },
  

  async alterarMarca(marca) {
    return await Marca
      .updateOne(
        {
          _id: marca._id,
        },
        {
          $set: marca
        }
      )
      .catch(erro => {
        console.log(erro)
      });
  }
}