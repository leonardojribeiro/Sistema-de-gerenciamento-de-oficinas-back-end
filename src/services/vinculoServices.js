const validacao = require("../util/validacao");
const Vinculo = require("../models/Vinculo");

module.exports = class VinculoServices {

  validar(vinculo) {
    const mensagens = [];
    !validacao.validarTexto(vinculo.idCliente) && mensagens.push("Id do cliente é obrigatório.");
    !validacao.validarTexto(vinculo.idVeiculo) && mensagens.push("Id do veículo é obrigatório.");
    !validacao.validarTexto(vinculo.idOficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens
  }

  async inserir(vinculo) {
    return await Vinculo
      .create(vinculo)
      .catch(erro => {
        console.log(erro);
      });
  }

  async contarPorIdClienteIdVeiculoEIdOficina(vinculo) {
    return await Vinculo
      .countDocuments({
        idCliente: vinculo.idCliente,
        idVeiculo: vinculo.idVeiculo,
        idOficina: vinculo.idOficina,
        vinculoFinal: undefined
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  async listarPorIdVeiculoEIdOficina(vinculo) {
    return await Vinculo
      .findOne({
        idVeiculo: vinculo.idVeiculo,
        idOficina: vinculo.idOficina,
        vinculoFinal: undefined
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  async alterarVinculo(vinculo) {
    return await Vinculo
      .replaceOne(
        {
          _id: vinculo.id
        },
        vinculo
      )
      .catch(erro => {
        console.log(erro);
      })
  }

}