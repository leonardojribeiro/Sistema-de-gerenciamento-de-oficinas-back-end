const EspecialidadeServices = require('../services/EspecialidadeServices');
const servicoValidacao = require('../services/servicoValidacao');
const especialidadeServices = new EspecialidadeServices();

module.exports = {

  async inserirEspecialidade(requisicao, resposta) {
    const { descricao, idOficina } = requisicao.body;
    const especialidadeASerInserida = {
      descricao,
      idOficina,
    };

    console.log(especialidadeASerInserida);
    const mensagens = especialidadeServices.validarEspecialidadeASerInserida(especialidadeASerInserida);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    };
    const especialidadeExistenteNaOficina = await especialidadeServices.contarPorDescricaoEIdOficina(especialidadeASerInserida);
    if (especialidadeExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Especialidade já cadastrada."
        });
    }
    const especialidadeInserida = await especialidadeServices.inserir(especialidadeASerInserida);
    if (!especialidadeInserida) {
      return resposta.status(500)
        .json({
          mensagem: "Especialidade não cadastrada."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Especialidade cadastrada com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao.query;
    const mensagens = servicoValidacao.validarIdDaOficina(idOficina);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const modelos = await especialidadeServices.listarPorIdOficina(idOficina);
    return resposta.json(modelos);
  },

  async listarEspecialidadePorId(requisicao, resposta) {
    const { idOficina, _id } = requisicao.query;
    const informacoesDaEspecialidade = {
      _id,
      idOficina,
    }
    const mensagens = especialidadeServices.validarIdEspecialidadeEIdOficina(informacoesDaEspecialidade);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const especialidadeListada = await especialidadeServices.listarPorIdEspecialidadeEIdOficina(informacoesDaEspecialidade);
    if (!especialidadeListada) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar especialidade."
        });
    }
    return resposta.json(especialidadeListada)
  },

  async alterarEspecialidade(requisicao, resposta) {
    const { idOficina, descricao, _id } = requisicao.body;
    const especialidadeASerAlterada = {
      _id,
      descricao,
      idOficina,
    }
    const mensagens = especialidadeServices.validarEspecialidadeASerAlterada(especialidadeASerAlterada);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const resultado = especialidadeServices.alterarEspecialidade(especialidadeASerAlterada);
    if (!resultado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Especialidade não alterada."
        });
    }
    return resposta
      .status(201)
      .json({ mensagem: "Especialidade alterada com sucesso." });
  },
};