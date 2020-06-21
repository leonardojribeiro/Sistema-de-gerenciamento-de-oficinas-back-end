const validacao = require("../util/validacao");
const { inserir } = require("./UsuarioServices");
const Cliente = require("../models/Cliente");

module.exports = {
  validar(cliente) {
    const mensagens = [];
    !validacao.validarTexto(cliente.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarTexto(cliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    !validacao.validarTexto(cliente.cpfCnpj) && mensagens.push("CPF/CNPJ é obrigatório.")
      || !validacao.validarCpfCnpj(cliente.cpfCnpj) && mensagens.push("CPF/CNPJ inválido");
    validacao.validarTexto(cliente.telefoneFixo) &&
      !validacao.validarTelefone(cliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(cliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(cliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(cliente.email) &&
      !validacao.validarTexto(cliente.email) && !validacao.validarEmail(cliente.email) && mensagens.push("E-mail inválido.");
    !validacao.validarTexto(cliente.endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
    !validacao.validarTexto(cliente.endereco.numero) && mensagens.push("Número é obrigatório.");
    !validacao.validarTexto(cliente.endereco.bairro) && mensagens.push("Endereço é obrigatório.");
    !validacao.validarTexto(cliente.endereco.cep) && mensagens.push("CEP é obrigatório.")
      || !validacao.validarCep(cliente.endereco.cep) && mensagens.push("CEP inválido.");
    !validacao.validarTexto(cliente.endereco.cidade) && mensagens.push("Cidade é obrigatória.");
    !validacao.validarTexto(cliente.endereco.estado) && mensagens.push("Estado é obrigatório");
    !validacao.validarTexto(cliente.idOficina) && mensagens.push("Id da oficina é obrigatório.")
    return mensagens;
  },

  async inserir(cliente) {
    return await Cliente
      .create(cliente)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarClientesPorCpfEIdOficina(cliente) {
    return await Cliente
      .countDocuments({
        cpf: cliente.cpf,
        idOficina: cliente.idOficina,
      })
      .catch(erro => {
        console.log(erro);
      })
  },
}