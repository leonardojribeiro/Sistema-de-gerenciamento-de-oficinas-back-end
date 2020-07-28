const Modelo = require('../models/Modelo');
const ModeloServices = require('../services/ModeloServices');

const modeloServices = new ModeloServices();

module.exports = {

  async inserirModelo(requisicao, resposta) {
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
    const modeloExistenteNaOficina = await modeloServices.contarPorDescricaoDoModeloEIdOficina(modeloASerInserido);
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
    const mensagens = modeloServices.validarIdDaOficina(idOficina);
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
    const modeloListado = await modeloServices.listarPorIdModeloEIdOficina(informacoesDoModelo);
    if (!modeloListado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar modelo."
        });
    }
    return resposta.json(modeloListado);
  },

  async consultar(requisicao, resposta) {
    const { idOficina, consulta, tipo } = requisicao.query;
    const informacoesDaConsulta = {
      idOficina,
      consulta,
      tipo
    };
    const mensagens = modeloServices.validarInformacoesDaConsulta(informacoesDaConsulta);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modelosListados = await modeloServices.consultar(informacoesDaConsulta);
    if (!modelosListados) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar modelos."
        });
    }
    return resposta.json(modelosListados);
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
          mensagem: "Modelo não alterado."
        });
    }
    return resposta.status(201).json({ mensagem: "Modelo alterado com sucesso." });
  },
}