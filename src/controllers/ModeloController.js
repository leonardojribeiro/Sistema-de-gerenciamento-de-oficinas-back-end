const Modelo = require('../models/Modelo');
const modeloServices = require('../services/modeloServices');

class ModeloController {
  async index(requisicao, resposta) {
    console.log("index modelo");
    const modelo = await Modelo.find().populate(
      {
        path: "marca",
        populate: {
          path: "marca"
        }
      }
    ).then().catch(e => { console.log(e) });
    resposta.json({ modelo: modelo });
  }

  async incluirDadosDeModelo(requisicao, resposta) {

    const { descricao, idMarca, idOficina } = requisicao.body;

    const modeloASerInserido = {
      descricao,
      idMarca,
      idOficina,
    };

    const mensagens = modeloServices.validarModelo(modeloASerInserido);

    if (mensagens.length) {
      return resposta
        .status(406)
        .json({
          mensagem: mensagens
        });
    }

    const modeloExistenteNaOficina = await modeloServices.contarPorDescricaoEIdOficina(modeloASerInserido);

    if(modeloExistenteNaOficina){
      return resposta.status(406)
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
  }

  async editar(req, res) {

    console.log(req.body);
    const { _id, nome, cpf, especialidade } = req.body;

    const funcionario = await Modelo.update({
      _id,
      nome,
      cpf,
      especialidade
    }).then().catch(e => { });

    return res.json(funcionario);
  }
}

module.exports = ModeloController;