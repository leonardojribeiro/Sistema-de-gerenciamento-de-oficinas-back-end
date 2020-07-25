const validacao = require("../util/validacao");
const { inserir } = require("./marcaServices");
const Veiculo = require("../models/Veiculo");
const servicoValidacao = require("./servicoValidacao");
const { Types } = require("mongoose");

module.exports = class VeiculoServices {
  validarVeliculoASerInserido(veiculo) {
    const mensagens = [];
    !validacao.validarTexto(veiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(veiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarTexto(veiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarTexto(veiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(veiculo.idModelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(veiculo.idCliente));
    mensagens.push(...servicoValidacao.validarIdDaOficina(veiculo.idOficina));
    return mensagens;
  }

  validarIdDaOficina(idOficina) {
    return servicoValidacao.validarIdDaOficina(idOficina);
  }

  async inserir(veiculo) {
    return await Veiculo
      .create(veiculo)
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
      .match({
        idOficina: Types.ObjectId(idOficina)
      })
      .unwind("cliente")
      .unwind("vinculo")
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
}
/*
.aggregate([{
  $lookup: {
    from: 'vinculos',
    localField: "_id",
    foreignField: "idVeiculo",
    as: "vinculo",
  },
},
{
  $lookup: {
    from: "clientes",
    localField: "vinculo.idCliente",
    foreignField: "_id",
    as: "cliente"
  },
}])*/