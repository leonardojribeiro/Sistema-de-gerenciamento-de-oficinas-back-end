const Veiculo = require('../models/Veiculo');
const VeiculoServices = require('../services/VeiculoServices');
const VinculoServices = require('../services/VinculoServices');

const veiculoServices = new VeiculoServices();
const vinculoServices = new VinculoServices();

module.exports = {

  async inserirVeiculo(requisicao, resposta) {
    const { placa, anoFabricacao, anoModelo, idModelo, idOficina, idCliente } = requisicao.body;
    const veiculoASerInserido = {
      placa,
      anoFabricacao,
      anoModelo,
      idModelo,
      idCliente,
      idOficina,
    }
    const mensagens = veiculoServices.validarVeliculoASerInserido(veiculoASerInserido);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const veiculoExistenteNaOficina = await veiculoServices.contarPorPlacaEIdOficina(veiculoASerInserido);
    if (veiculoExistenteNaOficina) {
      return resposta
        .status(406)
        .json({
          mensagem: "Esse veículo já está cadastrado."
        });
    }
    const veiculoInserido = await veiculoServices.inserirVeiculo(veiculoASerInserido);
    if (!veiculoInserido) {
      return resposta
        .status(500)
        .json({
          mensagem: "Veículo não cadastrado."
        });
    }
    const vinculoASerCriado = {
      vinculoInicial: Date.now(),
      idCliente,
      idVeiculo: veiculoInserido._id,
      idOficina,
    }
    const vinculo = await vinculoServices.inserir(vinculoASerCriado)
    if (!vinculo) {
      return resposta
        .status(500)
        .json({
          mensagem: "Veículo cadastrado, porém não vinculado."
        });
    }
    return resposta
      .status(201)
      .json({
        mensagem: "Veículo cadastrado com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao.query;
    const mensagens = veiculoServices.validarIdDaOficina(idOficina);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const veiculos = await veiculoServices.listarPorIdOficina(idOficina);
    return resposta.json(veiculos);
  },

  async listarPorId(requisicao, resposta) {
    const { idOficina, _id } = requisicao.query;
    const informacoesDoVeiculo = {
      _id,
      idOficina,
    }
    const mensagens = veiculoServices.validarIdVeiculoEIdOficina(informacoesDoVeiculo);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }
    const veiculoListado = await veiculoServices.listarPorIdVeiculoEIdOficina(informacoesDoVeiculo);
    if (!veiculoListado || !veiculoListado.length) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar especialidade."
        });
    }
    return resposta.json(veiculoListado[0])
  },

  async alterarVeiculo(requisicao, resposta) {
    const { _id, placa, anoFabricacao, anoModelo, idModelo, idOficina, idCliente } = requisicao.body;
    const veiculoASerAlterado = {
      _id,
      placa,
      anoFabricacao,
      anoModelo,
      idModelo,
      idCliente,
      idOficina,
    }
    const mensagens = veiculoServices.validarVeliculoASerAlterado(veiculoASerAlterado);
    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }

    const informacoesDoVinculo = {
      idCliente,
      idVeiculo: _id,
      idOficina,
    }
    //conta os vinculos que tem o mesmo ids e que não estão com vínculo final
    const vinculoExistente = await vinculoServices.contarPorIdClienteIdVeiculoEIdOficina(informacoesDoVinculo);
    console.log(vinculoExistente)
    if (!vinculoExistente) {//se existe um vínculo, nada é alterado nos vínculos, mas se não existir, ele é criado
      //lista o último vínculo, que está sem data final
      const vinculoAnterior = await vinculoServices.listarPorIdVeiculoEIdOficina(informacoesDoVinculo);
      console.log(vinculoAnterior);

      if (vinculoAnterior) {
        vinculoAnterior.vinculoFinal = Date.now();//adiciona a data atual como vinculo final
        await vinculoServices.alterarVinculo(vinculoAnterior);//salva o vínculo anterior
      }

      informacoesDoVinculo.vinculoInicial = Date.now();

      const vinculo = await vinculoServices.inserir(informacoesDoVinculo)
      if (!vinculo) {
        return resposta
          .status(500)
          .json({
            mensagem: "Veículo alterado, porém não vinculado." 
          });
      }
    }
    const resultado = await veiculoServices.alterarVeiculo(veiculoASerAlterado);
    if (!resultado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Veículo não alterado."
        });
    }
    return resposta
    .json({
      mensagem: "Veículo alterado com sucesso."
    })
  }

}
