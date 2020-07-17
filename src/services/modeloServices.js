const validacao = require("../util/validacao");
const { inserir, contarPorDescricaoEIdOficina } = require("./marcaServices");
const Modelo = require("../models/Modelo");
const { alterarMarca } = require("../controllers/MarcaController");
const { alterarModelo } = require("../controllers/ModeloController");


module.exports = {

  validarIdDaOficina(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(modelo.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },

  validarModeloASerInserido(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(modelo.idMarca) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(modelo.idMarca) && mensagens.push("Id da marca inválido.");
    !validacao.validarTexto(modelo.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(modelo.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens
  },

  validarIdDaOficinaEIdDoModelo(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo._id) && mensagens.push("Id do modelo é obrigatório.")
      || !validacao.validarId(modelo._id) && mensagens.push("Id do modelo inválido.");
    !validacao.validarTexto(modelo.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(modelo.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens
  },

  validarModeloASerAlterado(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(modelo.idMarca) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(modelo.idMarca) && mensagens.push("Id da marca inválido.");
    !validacao.validarTexto(modelo.idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(modelo.idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens
  },

  async inserir(modelo) {
    return await Modelo
      .create(modelo)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorDescricaoEIdOficina(modelo) {
    return await Modelo
      .countDocuments({
        descricao: modelo.descricao,
        idMarca: modelo.idMarca,
        idOficina: modelo.idOficina
      })
      .catch(erro => {
        console.log(erro);
      });
  },

  async listarPorIdOficina(idOficina) {
    return await Modelo
      .find({
        idOficina,
      })
      .populate({
        path: "idMarca"
      })
      .catch(erro => {
        console.log(erro)
      })
  },

  async listarPorIdOficinaEIdModelo(modelo) {
    return await Modelo
      .findOne(modelo)
      .catch(erro => {
        console.log(erro);
      })
  },

  async listarPorDescricaoParcialEIdOficina(modelo) {
    return await Modelo
      .find({
        descricao: {
          $regex: modelo.descricao,
          $options: "i",
        },
        idOficina: modelo.idOficina,
      })
      .populate({
        path: "idMarca"
      })
      .catch(erro => {
        console.log(erro);
      });
  },

  async alterarModelo(modelo){
    return await Modelo
    .updateOne(
      {
        _id: modelo._id,
      },
      modelo
    )
  }

}