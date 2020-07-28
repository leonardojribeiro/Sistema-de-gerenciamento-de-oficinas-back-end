const validacao = require("../util/validacao");
const Modelo = require("../models/Modelo");
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
  
  validarIdDaOficina(idOficina) {
    return servicoValidacao.validarIdDaOficina(idOficina);
  }

  validarModeloASerInserido(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(modelo.idMarca));
    mensagens.push(...this.validarIdDaOficina(modelo.idOficina));
    return mensagens
  }

  validarIdDaOficinaEIdDoModelo(modelo) {
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDoModelo(modelo._id));
    mensagens.push(...this.validarIdDaOficina(modelo.idOficina));
    return mensagens
  }

  validarModeloASerAlterado(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDaMarca(modelo.idMarca));
    mensagens.push(...this.validarIdDaOficina(modelo.idOficina));
    return mensagens
  }

  validarInformacoesDaConsulta(informacoes) {
    const mensagens = [];
    mensagens.push(...this.validarIdDaOficina(informacoes.idOficina));
    !validacao.validarNumero(informacoes.tipo) && mensagens.push("Tipo da busca é obrigatório.")
      || !(informacoes.tipo === "0" || informacoes.tipo === "1") && mensagens.push("Tipo da busca inválido.")
    return mensagens;
  }

  async inserir(modelo) {
    return await Modelo
      .create(modelo)
      .catch(erro => {
        console.log(erro);
      });
  }

  async contarPorDescricaoDoModeloEIdOficina(modelo) {
    return await Modelo
      .countDocuments({
        descricao: modelo.descricao,
        idMarca: modelo.idMarca,
        idOficina: modelo.idOficina
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  async listarPorIdOficina(idOficina) {
    return await Modelo
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

  async listarPorIdModeloEIdOficina(modelo) {
    return await Modelo
      .findOne(modelo)
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
    return await Modelo
      .aggregate()
      .lookup(agregacao)
      .match(match)
      .unwind("marca")
      .project(selecaoCampos)
      .catch(erro => console.log(erro))
  }

  async alterarModelo(modelo) {
    return await Modelo
      .updateOne(
        {
          _id: modelo._id,
        },
        modelo
      )
  }

}