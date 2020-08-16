const validacao = require("../util/validacao");
const Servico = require("../models/Servico");

module.exports = class ServicoServices {
  validarServico(informacoesDoServico) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoServico.descricao) && mensagens.push('Descricao é obrigatório.');
    !validacao.validarNumero(informacoesDoServico.tempoDuracao) && mensagens.push('Tempo de duração é obrigatório');
    !validacao.validarNumero(informacoesDoServico.valor) && mensagens.push("Valor é obrigatório.");
    return mensagens;
  }

  async contarServicosPorDescricaoEIdOficina(informacoesDoServico){
    return await Servico
    .countDocuments({
      idOficina: informacoesDoServico.idOficina,
      descricao: informacoesDoServico.descricao,
    })
    .catch(erro => console.log(erro));
  }

  async inserirServico(informacoesDoServico) {
    return await Servico
      .create(informacoesDoServico)
      .catch(erro => console.log(erro));
  }
}