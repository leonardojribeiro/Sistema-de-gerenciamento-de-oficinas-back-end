const Modelo = require('../models/Modelo');
const modeloServices = require('../services/modeloServices');

module.exports = {
  
  async incluirDadosDeModelo(requisicao, resposta) {
    const { descricao, idMarca, idOficina } = requisicao.body;
    const modeloASerInserido = {
      descricao,
      idMarca,
      idOficina,
    };
    const mensagens = modeloServices.validarModeloASerInserido(modeloASerInserido);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modeloExistenteNaOficina = await modeloServices.contarPorDescricaoEIdOficina(modeloASerInserido);
    if (modeloExistenteNaOficina) {
      return resposta
        .status(406)
        .json({
          mensagem: "Esse modelo já está cadastrado"
        });
    }
    const modeloInserido = await modeloServices.inserir(modeloASerInserido);
    if (!modeloInserido) {
      return resposta
        .status(500)
        .json({
          mensagem: "Modelo não cadastrado."
        });
    }
    return resposta
      .status(201)
      .json({
        mensagem: "Modelo cadastrado com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao.query;
    const mensagens = modeloServices.validarIdDaOficina({ idOficina });
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modelos = await modeloServices.listarPorIdOficina(idOficina);
    return resposta.json(modelos);
  },

  async listarModeloPorId(requisicao, resposta) {
    const { idOficina, _id } = requisicao.query;
    const informacoesDoModelo = {
      _id,
      idOficina,
    }
    const mensagens = modeloServices.validarIdDaOficinaEIdDoModelo(informacoesDoModelo);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modeloListado = await modeloServices.listarPorIdOficinaEIdModelo(informacoesDoModelo);
    if (!modeloListado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar marca."
        });
    }
    return resposta.json(modeloListado);
  },

  async listarPorDescricaoParcialEIdOficina(requisicao, resposta){
    const { idOficina, descricao } = requisicao.query;
    const informacoesDoModelo = {
      descricao,
      idOficina,
    }
    const mensagens = modeloServices.validarIdDaOficina(informacoesDoModelo);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modelo = await modeloServices.listarPorDescricaoParcialEIdOficina(informacoesDoModelo);
    return resposta.json(modelo);
  },

  async alterarModelo(requisicao, resposta) {
    const { _id, descricao, idOficina, idMarca, } = requisicao.body;
    const modeloASerAlterado = {
      _id,
      descricao,
      idMarca,
      idOficina,
    }
    const mensagens = modeloServices.validarModeloASerAlterado(modeloASerAlterado);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const resultado = await modeloServices.alterarModelo(modeloASerAlterado);
    if (!resultado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Modelo não editada."
        });
    }
    return resposta.status(201).json({ mensagem: "Modelo alterado com sucesso." });
  }
}