const validacao = require("../util/validacao");
const Peca = require("../models/Peca");
const { Types } = require("mongoose");
const servicoValidacao = require("./servicoValidacao");

const selecaoCampos = {
  idMarca: 0,
  idOficina: 0,
  __v: 0,
  "marca.idOficina": 0,
  "marca.__v": 0
};

const agregacao = {
  from: "marcas",
  localField: "idMarca",
  foreignField: "_id",
  as: "marca",
};

module.exports = class ModeloService {
  
  validarIdDaOficina(modelo) {
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDaMarca(modelo.idOficina));
    return mensagens;
  }

  validarPecaASerInserida(peca) {
    const mensagens = [];
    !validacao.validarTexto(peca.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(peca.idMarca));
    mensagens.push(...this.validarIdDaOficina(peca));
    return mensagens
  }

  validarIdDaOficinaEIdDaPeca(peca) {
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDaPeca(peca._id));
    mensagens.push(...this.validarIdDaOficina(peca));
    return mensagens
  }

  validarPecaASerAlterada(peca) {
    const mensagens = [];
    !validacao.validarTexto(peca.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(peca.idMarca));
    mensagens.push(...this.validarIdDaOficina(peca));
    return mensagens
  }

  validarInformacoesDaConsulta(informacoes) {
    const mensagens = [];
    mensagens.push(...this.validarIdDaOficina(informacoes));
    !validacao.validarNumero(informacoes.tipo) && mensagens.push("Tipo da busca é obrigatório.")
      || !(informacoes.tipo === "0" || informacoes.tipo === "1") && mensagens.push("Tipo da busca inválido.")
    return mensagens;
  }

  async inserir(peca) {
    return await Peca
      .create(peca)
      .catch(erro => {
        console.log(erro);
      });
  }

  async contarPorDescricaoDaPecaEIdOficina(peca) {
    return await Peca
      .countDocuments({
        descricao: peca.descricao,
        idMarca: peca.idMarca,
        idOficina: peca.idOficina
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  async listarPorIdOficina(idOficina) {
    return await Peca
      .aggregate()
      .lookup(agregacao)
      .match({
        idOficina: Types.ObjectId(idOficina)
      })
      .unwind("marca")
      .project(selecaoCampos)
      .catch(erro =>
        console.log(erro)
      )
  }

  async listarPorIdOficinaEIdPeca(peca) {
    return await Peca
      .findOne(peca)
      .catch(erro => {
        console.log(erro);
      })
  }

  async consultar(consulta) {
    let match;
    switch (consulta.tipo) {
      case "0": {
        match = {
          descricao: {
            $regex: consulta.consulta,
            $options: "i",
          },
          idOficina: Types.ObjectId(consulta.idOficina)
        };
        break;
      }
      case "1": {
        match = {
          "marca.descricao": {
            $regex: consulta.consulta,
            $options: "i",
          },
          idOficina: Types.ObjectId(consulta.idOficina)
        };
        break;
      }
    }
    return await Peca
      .aggregate()
      .lookup(agregacao)
      .match(match)
      .unwind("marca")
      .project(selecaoCampos)
      .catch(erro => console.log(erro))
  }

  async alterarPeca(peca) {
    return await Peca
      .updateOne(
        {
          _id: peca._id,
        },
        peca
      )
  }

}