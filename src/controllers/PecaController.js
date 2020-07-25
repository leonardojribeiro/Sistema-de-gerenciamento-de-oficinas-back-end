const PecaServices = require('../services/PecaServices');
const pecaServices = new PecaServices();

module.exports = {

  async incluirDadosDePeca(requisicao, resposta) {
    const { descricao, idMarca, idOficina } = requisicao.body;
    const pecaASerInserida = {
      descricao,
      idMarca,
      idOficina,
    };
    const mensagens = pecaServices.validarPecaASerAlterada(pecaASerInserida);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const pecaExistenteNaOficina = await pecaServices.contarPorDescricaoDaPecaEIdOficina(pecaASerInserida);
    if (pecaExistenteNaOficina) {
      return resposta
        .status(406)
        .json({
          mensagem: "Essa peça já está cadastrada"
        });
    }
    const pecaInserida = await pecaServices.inserir(pecaASerInserida);
    if (!pecaInserida) {
      return resposta
        .status(500)
        .json({
          mensagem: "Peça não cadastrada."
        });
    }
    return resposta
      .status(201)
      .json({
        mensagem: "Peça cadastrada com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao.query;
    const mensagens = pecaServices.validarIdDaOficina({ idOficina });
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modelos = await pecaServices.listarPorIdOficina(idOficina);
    return resposta.json(modelos);
  },

  async listarPecaPorId(requisicao, resposta) {
    const { idOficina, _id } = requisicao.query;
    const informacoesDaPeca = {
      _id,
      idOficina,
    }
    const mensagens = pecaServices.validarIdDaOficinaEIdDaPeca(informacoesDaPeca);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const pecaListada = await pecaServices.listarPorIdOficinaEIdPeca(informacoesDaPeca);
    if (!pecaListada) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar modelo."
        });
    }
    return resposta.json(pecaListada);
  },

  async consultar(requisicao, resposta) {
    const { idOficina, consulta, tipo } = requisicao.query;
    const informacoesDaConsulta = {
      idOficina,
      consulta,
      tipo
    };
    const mensagens = pecaServices.validarInformacoesDaConsulta(informacoesDaConsulta);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const pecasListadas = await pecaServices.consultar(informacoesDaConsulta);
    if (!pecasListadas) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar marca."
        });
    }
    return resposta.json(pecasListadas);
  },

  async alterarPeca(requisicao, resposta) {
    const { _id, descricao, idOficina, idMarca, } = requisicao.body;
    const pecaASerAlterada = {
      _id,
      descricao,
      idMarca,
      idOficina,
    }
    const mensagens = pecaServices.validarPecaASerAlterada(pecaASerAlterada);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const resultado = await pecaServices.alterarPeca(pecaASerAlterada);
    if (!resultado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Peça não alterada."
        });
    }
    return resposta.status(201).json({ mensagem: "Peça alterada com sucesso." });
  },

}