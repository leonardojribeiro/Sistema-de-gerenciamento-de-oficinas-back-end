const vinculoServices = require("../services/vinculoServices");
const veiculoServices = require("../services/veiculoServices");

module.exports = class VinculoController {
  async incluir(requisicao, resposta) {
    const { idCliente, idVeiculo, idOficina } = requisicao.body;

    const vinculoASerInserido = {
      idCliente,
      idVeiculo,
      idOficina,
    }

    const mensagens = vinculoServices.validar(vinculoASerInserido);

    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    const vinculoExistente = await vinculoServices.contarPorIdClienteIdVeiculoEIdOficina(vinculoASerInserido);

    if (vinculoExistente) {
      return resposta.status(406)
        .json({
          mensagem: "Vinculo já cadastrado."
        });
    }

    //lista todos os vículos existentes com o mesmo veículo na oficina que não estão com vinculo final definidos
    const vinculoComVeiculo = await vinculoServices.listarPorIdVeiculoEIdOficina(vinculoASerInserido);
    console.log(vinculoComVeiculo);
    //adiciona a data atual como vinculo final
    if (vinculoComVeiculo) {
      vinculoComVeiculo.vinculoFinal = Date.now();
      await vinculoServices.alterarVinculo(vinculoComVeiculo);
    }
    //coloca a data atual como vinculo inicial
    vinculoASerInserido.vinculoInicial = Date.now();

    vinculoInserido = await vinculoServices.inserir(vinculoASerInserido);

    if (!vinculoInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Oficina candidata não cadastrado."
        });
    }

    return resposta.status(201)
      .json({
        mensagem: "Vinculo cadastrado com sucesso."
      });
  }
}