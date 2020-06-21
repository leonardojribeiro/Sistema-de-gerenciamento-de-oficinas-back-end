const validacao = require("../util/validacao");
const { inserir, contarPorDescricaoEIdOficina } = require("./marcaServices");
const Modelo = require("../models/Modelo");


module.exports = {

  validarModelo(modelo) {
    const mensagens = [];
    !validacao.validarTexto(modelo.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(modelo.idMarca) && mensagens.push("Id da marca é obrigatório.");
    !validacao.validarTexto(modelo.idOficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens
  },

  async inserir(modelo) {
    return await Modelo
      .create(modelo)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorDescricaoEIdOficina(modelo) {
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

}