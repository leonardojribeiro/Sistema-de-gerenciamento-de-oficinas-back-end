const validacao = require("../util/validacao");
const { inserir, contarPorDescricaoEIdOficina } = require("./marcaServices");
const Especialidade = require("../models/Especialidade");


module.exports = {
  validar(especialidade) {
    const mensagens = [];
    !Validacao.validarTexto(especialidade.descricao) && mensagens.push("Descrição é obrigatório");
    !Validacao.validarTexto(especialidade.idOficina) && mensagens.push("Id da oficina é obrigatório");
    return mensagens;
  },

  async inserir(especialidade, opt) {
    return await Especialidade
      .create([especialidade], opt)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorDescricaoEIdOficina(especialidade) {

    return await Especialidade
      .countDocuments({
        descricao: especialidade.descricao,
        idOficina: especialidade.idOficina,
      })
      .catch(erro => {
        console.log(erro);
      });
  },

}