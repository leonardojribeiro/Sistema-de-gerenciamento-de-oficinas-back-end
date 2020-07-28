const validacao = require("../util/validacao");
const Veiculo = require("../models/Veiculo");
const servicoValidacao = require("./servicoValidacao");
const { Types } = require("mongoose");

module.exports = class VeiculoServices {
  validarVeliculoASerInserido(informacoesDoVeiculo) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarTexto(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarTexto(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.idModelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.idCliente));
    mensagens.push(...servicoValidacao.validarIdDaOficina(informacoesDoVeiculo.idOficina));
    return mensagens;
  }

  validarIdDaOficina(idOficina) {
    return servicoValidacao.validarIdDaOficina(idOficina);
  }

  validarVeliculoASerAlterado(informacoesDoVeiculo) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarTexto(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarTexto(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.idModelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.idCliente));
    mensagens.push(...servicoValidacao.validarIdDaOficina(informacoesDoVeiculo.idOficina));
    mensagens.push(...servicoValidacao.validarIdDoVeiculo(informacoesDoVeiculo._id));
    return mensagens;
  }

  validarIdVeiculoEIdOficina(informacoesDoVeiculo) {
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDaOficina(informacoesDoVeiculo.idOficina));
    mensagens.push(...servicoValidacao.validarIdDoVeiculo(informacoesDoVeiculo._id));
    return mensagens
  }

  async inserirVeiculo(informacoesDoVeiculo) {
    return await Veiculo
      .create(informacoesDoVeiculo)
      .catch(erro => {
        console.log(erro);
      })
  }

  async contarPorPlacaEIdOficina(veiculo) {
    return await Veiculo
      .countDocuments({
        placa: veiculo.placa,
        idOficina: veiculo.idOficina,
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  async listarPorIdOficina(idOficina) {
    return await Veiculo
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "idVeiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        idOficina: Types.ObjectId(idOficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.idCliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "idModelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.idMarca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("modelo")
      .unwind("marca")
      .project({
        idModelo: 0,
        idOficina: 0,
        __v: 0,
        vinculo: 0,
        "cliente.__v": 0,
        "cliente.endereco": 0,
        "cliente.idOficina": 0,
        "modelo.idMarca": 0,
        "modelo.idOficina": 0,
        "modelo.__v": 0,
        "marca.idOficina": 0,
        "marca.__v": 0,

      })
      .catch(erro => console.log(erro))
  }

  async listarPorIdVeiculoEIdOficina(informacoesDoVeiculo) {
    return await Veiculo
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "idVeiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        _id: Types.ObjectId(informacoesDoVeiculo._id),
        idOficina: Types.ObjectId(informacoesDoVeiculo.idOficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.idCliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "idModelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.idMarca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("cliente")
      .unwind("modelo")
      .unwind("marca")
      .group({
        _id: "$_id",
        idCliente: {
          $first: "$cliente._id"
        },
        idModelo: {
          $first: "$modelo._id"
        },
        placa: {
          $first: "$placa"
        },
        anoFabricacao: {
          $first: "$anoFabricacao"
        },
        anoModelo: {
          $first: "$anoModelo"
        }
      })
      .catch(erro => console.log(erro))
  }

  async alterarVeiculo(informacoesDoVeiculo) {
    return await Veiculo
      .updateOne(
        {
          _id: informacoesDoVeiculo._id
        },
        {
          $set: informacoesDoVeiculo
        }
      )
      .catch(erro => console.log(erro));
  }
}