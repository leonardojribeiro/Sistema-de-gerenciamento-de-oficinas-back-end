const { inserir } = require("../services/usuarioServices");
const ServicoServices = require("../services/ServicosServices");
const servicoServices = new ServicoServices();
module.exports = {
  async inserirServico(requisicao, resposta) {
    const idOficina = requisicao.idOficina;
    const {
      descricao,
      tempoDuracao,
      valor
    } = requisicao.body;

    const informacoesDoServico = {
      descricao,
      tempoDuracao,
      valor,
      idOficina,
    }

    const mensagens = servicoServices.validarServico(informacoesDoServico);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    const servicoExistenteNaOficina = await servicoServices.contarServicosPorDescricaoEIdOficina(informacoesDoServico);
    console.log(servicoExistenteNaOficina)
    if (servicoExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Serviço já cadastrado."
        });
    }

    const clienteInserido = await servicoServices.inserirServico(informacoesDoServico);
    if (!clienteInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Serviço não cadastrado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Serviço cadastrado com sucesso."
      });

    return resposta.status(200).send()
  },
}