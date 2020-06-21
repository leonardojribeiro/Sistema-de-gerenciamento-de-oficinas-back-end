const Validacao = require("../util/Validacao");
const { inserir } = require("./clienteServices");
const Funcionario = require("../models/Funcionario");


module.exports = {
  validarFuncionario(funcionario) {
    const mensagens = [];
    !validacao.validarTexto(funcionario.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarTexto(funcionario.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    !validacao.validarTexto(funcionario.cpf) && mensagens.push("CPF é obrigatório.")
      || !validacao.validarCpfCnpj(funcionario.cpf) && mensagens.push("CPF inválido");
    validacao.validarTexto(funcionario.telefoneFixo) &&
      !validacao.validarTelefone(funcionario.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(funcionario.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(funcionario.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(funcionario.email) &&
      !validacao.validarTexto(funcionario.email) && !validacao.validarEmail(funcionario.email) && mensagens.push("E-mail inválido.");
    !validacao.validarTexto(funcionario.endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
    !validacao.validarTexto(funcionario.endereco.numero) && mensagens.push("Número é obrigatório.");
    !validacao.validarTexto(funcionario.endereco.bairro) && mensagens.push("Endereço é obrigatório.");
    !validacao.validarTexto(funcionario.endereco.cep) && mensagens.push("CEP é obrigatório.")
      || !validacao.validarCep(funcionario.endereco.cep) && mensagens.push("CEP inválido.");
    !validacao.validarTexto(funcionario.endereco.cidade) && mensagens.push("Cidade é obrigatória.");
    !validacao.validarTexto(funcionario.endereco.estado) && mensagens.push("Estado é obrigatório");
    !validacao.validarTexto(funcionario.idOficina) && mensagens.push("Id da oficina é obrigatório.")
    return mensagens;
  },

  async inserir(funcionario) {
    return await Funcionario
      .create(funcionario)
      .catch(erro => {
        console.log(erro);
      })
  }
}