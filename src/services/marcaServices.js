const Marca = require("../models/Marca");
const validacao = require("../util/validacao");
const { promisify } = require("util");

module.exports = {

  async apagarLogomarca(uriLogomarca) {
    await promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", uriLogomarca),
    );
  },

  validarMarca(marca) {
    const mensagens = [];
    !validacao.validarTexto(marca.descricao) && mensagens.push("Descrição é obrigatório.");
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens;
  },

  validarIdDaOficina(marca){
    const mensagens = [];
    !validacao.validarTexto(marca.idOficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens;
  },

  async inserir(marca) {
    return await Marca
      .create(marca)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorDescricaoEIdOficina(marca) {
    return await Marca
      .countDocuments({
        descricao: marca.descricao,
        idOficina: marca.idOficina,
      })
      .catch(erro => {
        console.log(erro)
      })
  },

  async listarPorOficina(marca){
    return await Marca
    .find({
      idOficina: marca.idOficina
    })
    .catch(erro => {
      console.log(erro)
    });
  }
}