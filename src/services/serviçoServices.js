const validacao = require("../util/validacao");

module.exports = {

  validar(servico){
    const mensagens = [];
    !Validacao.validarTexto(servico.descricao) && mensagens.push("Descrição é obrigatório.");
    //!Validacao.valida
    return mensagens;
  }

}