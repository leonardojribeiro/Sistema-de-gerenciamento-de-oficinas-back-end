const Marca = require('../models/Marca');
const mongoose = require('mongoose');
const marcaServices = require('../services/marcaServices');
const path = require("path");
const crypto = require("crypto");
const GoogleStorage = require('../util/GoogleStorage');

module.exports = {

  async incluirDadosDaMarca(requisicao, resposta) {

    const { descricao, idOficina } = requisicao.body;
    const marcaASerInserida = {
      descricao,
      idOficina,
    }

    const mensagens = marcaServices.validarMarca(marcaASerInserida);

    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    const marcaExistenteNaOficina = await marcaServices.contarPorDescricaoEIdOficina(marcaASerInserida);

    if (marcaExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Essa marca já está cadastrada"
        });
    }

    const file = requisicao.file;

    let nome = crypto.randomBytes(16);
    nome = `${nome.toString("hex")}${path.extname(file.originalname)}`;

    const upload = await GoogleStorage.salvar(nome, file.buffer);

    if(!upload){
      return resposta.status(500)
        .json({
          mensagem: "Marca não cadastrada."
        });
    }

    marcaASerInserida.uriLogo = nome;

    const marcaInserida = await marcaServices.inserir(marcaASerInserida);

    if (!marcaInserida) {
      return resposta.status(500)
        .json({
          mensagem: "Marca não cadastrada."
        });
    }

    return resposta
      .status(201)
      .json({
        mensagem: "Marca cadastrada com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao.query;

    const marca = {
      idOficina
    }

    const marcas = await marcaServices.listarPorOficina(marca);

    return resposta.json(marcas);

  },

  async listarPorDescricao(req, res) {
    const { descricao } = req.query;
    console.log(descricao);
    const marca = await Marca.find({
      descricao: {
        $regex: descricao,
        $options: "i",
      }
    });
    return res.json({ marca: marca });
  },

  async listarPorModelo(req, res) {
    const { _id } = req.query;
    console.log(_id);
    const marca = await Marca.aggregate(
      [{
        $lookup: {
          from: "modelos",
          localField: "_id",
          foreignField: "marca",
          as: "modelo"
        }
      },
      {
        $match: {
          "modelo._id": mongoose.Types.ObjectId(_id)
        }
      }]
    );
    return res.json({ marca: marca });
  },

  async listarPorId(req, res) {
    const { _id } = req.query;
    console.log(req.params);
    const marca = await Marca.findOne({
      _id: _id
    });
    return res.json({ marca: marca });
  },

  async alterar(req, res) {
    const { _id, descricao, caminhoLogo } = req.body;
    const marca = await Marca.updateOne(
      {
        _id
      },
      {
        descricao,
        caminhoLogo,
      }).then().catch(e => { console.log(e) });
    return res.json(marca);
  },
}
