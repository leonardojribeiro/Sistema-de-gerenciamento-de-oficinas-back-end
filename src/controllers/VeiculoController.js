const Veiculo = require('../models/Veiculo');
const VeiculoServices = require('../services/VeiculoServices');
const vinculoServices = require('../services/vinculoServices');

const veiculoServices = new VeiculoServices();

class VeiculoController {
 
  async incluirDadosDeVeiculo(requisicao, resposta) {
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
    if(veiculoExistenteNaOficina){
      return resposta
        .status(406)
        .json({
          mensagem: "Esse veículo já está cadastrado."
        });
    }
    const veiculoInserido = await veiculoServices.inserir(veiculoASerInserido);
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
  }

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
  }

  async editar(req, res) {

    console.log(req.body);
    const { _id, nome, cpf, especialidade } = req.body;

    const funcionario = await Veiculo.update({
      _id,
      nome,
      cpf,
      especialidade
    }).then().catch(e => { });

    return res.json(funcionario);
  }
}

module.exports = VeiculoController;