const Veiculo = require('../models/Veiculo');
const veiculoServices = require('../services/veiculoServices');

class VeiculoController {
  async index(requisicao, resposta) {
    console.log(requisicao.body);
    const { marca, modelo } = requisicao.body;
    const veiculo = await Veiculo.aggregate([
      {
        $lookup: {
          from: "modelos",
          localField: "modelo",
          foreignField: "_id",
          as: "modelo",

        },
      },
      {
        $lookup: {
          from: "marcas",
          localField: "modelo.marca",
          foreignField: "_id",
          as: "marca"
        }
      },
    ]).then().catch(e => { console.log(e) });
    resposta.json({ veiculo: veiculo });
  }

  async incluirDadosDeVeiculo(requisicao, resposta) {
    const { placa, anoFabricacao, anoModelo, idModelo, idOficina } = requisicao.body;

    const veiculoASerInserido = {
      placa,
      anoFabricacao,
      anoModelo,
      idModelo,
      idOficina,
    }

    const mensagens = veiculoServices.validar(veiculoASerInserido);

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

    return resposta
    .status(201)
    .json({
      mensagem: "Veículo cadastrado com sucesso."
    });

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