const validacao = require("../util/validacao");
const { inserir } = require("./marcaServices");
const Veiculo = require("../models/Veiculo");

module.exports = {
  validar(veiculo) {
    const mensagens = [];
    !validacao.validarTexto(veiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(veiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarTexto(veiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarTexto(veiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    !validacao.validarTexto(veiculo.idModelo) && mensagens.push("Id da marca é obrigatório.");
    !validacao.validarTexto(veiculo.idOficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens;
  },

  async inserir(veiculo) {
    return await Veiculo
      .create(veiculo)
      .catch(erro => {
        console.log(erro);
      })
  },

  async contarPorPlacaEIdOficina(veiculo){
    return await Veiculo
    .countDocuments({
      placa: veiculo.placa,
      idOficina: veiculo.idOficina,
    })
    .catch(erro => {
      console.log(erro);
    })
  }
}