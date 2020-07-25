const validacao = require("../util/validacao");

module.exports = {
  validarIdDaOficina(idOficina) {
    const mensagens = [];
    !validacao.validarTexto(idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },
  validarIdDaMarca(idMarca) {
    const mensagens = [];
    !validacao.validarTexto(idMarca) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(idMarca) && mensagens.push("Id da marca inválido.");
    return mensagens;
  },
  validarIdDoModelo(idModelo) {
    const mensagens = [];
    !validacao.validarTexto(idModelo) && mensagens.push("Id do modelo é obrigatório.")
      || !validacao.validarId(idModelo) && mensagens.push("Id do modelo inválido.");
    return mensagens;
  },
  validarIdDaPeca(idPeca) {
    const mensagens = [];
    !validacao.validarTexto(idPeca) && mensagens.push("Id da peça é obrigatório.")
      || !validacao.validarId(idPeca) && mensagens.push("Id da peça inválido.");
    return mensagens;
  },
  validarIdDoCliente(idCliente) {
    const mensagens = [];
    !validacao.validarTexto(idCliente) && mensagens.push("Id do cliente é obrigatório.")
      || !validacao.validarId(idCliente) && mensagens.push("Id do cliente inválido.");
    return mensagens;
  },



  validarEndereco(endereco) {
    const mensagens = []
    if (endereco) {
      !validacao.validarTexto(endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
      !validacao.validarTexto(endereco.numero) && mensagens.push("Número é obrigatório.");
      !validacao.validarTexto(endereco.bairro) && mensagens.push("Bairro é obrigatório.");
      !validacao.validarTexto(endereco.cep) && mensagens.push("CEP é obrigatório.")
        || !validacao.validarCep(endereco.cep) && mensagens.push("CEP inválido.");
      !validacao.validarTexto(endereco.cidade) && mensagens.push("Cidade é obrigatória.");
      !validacao.validarTexto(endereco.estado) && mensagens.push("Estado é obrigatório");
    }
    else{
      mensagens.push("Informações do endereço são obrigatórias.");
    }
    return mensagens;
  }
}