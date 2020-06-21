const Oficina = require("../models/Oficina");

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const validacao = require("../util/validacao");

module.exports = {

  async apagarLogomarca(uriLogomarca) {
    await promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", uriLogomarca),
    );
  },

  validar(oficina) {
    const mensagens = [];
    !validacao.validarTexto(oficina.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(oficina.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(oficina.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(oficina.telefoneFixo) &&
      !validacao.validarTelefone(oficina.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(oficina.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(oficina.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    !validacao.validarTexto(oficina.email) && mensagens.push("E-mail é obrigatório.");
    !validacao.validarTexto(oficina.email) && !validacao.validarEmail(oficina.email) && mensagens.push("E-mail inválido.");
    !validacao.validarTexto(oficina.endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
    !validacao.validarTexto(oficina.endereco.numero) && mensagens.push("Número é obrigatório.");
    !validacao.validarTexto(oficina.endereco.bairro) && mensagens.push("Endereço é obrigatório.");
    !validacao.validarTexto(oficina.endereco.cep) && mensagens.push("CEP é obrigatório.")
      || !validacao.validarCep(oficina.endereco.cep) && mensagens.push("CEP inválido.");
    !validacao.validarTexto(oficina.endereco.cidade) && mensagens.push("Cidade é obrigatória.");
    !validacao.validarTexto(oficina.endereco.estado) && mensagens.push("Estado é obrigatório");
    !validacao.validarNumero(oficina.localizacao.coordinates[1]) && mensagens.push("Latitude é obrigatória.");
    !validacao.validarNumero(oficina.localizacao.coordinates[0]) && mensagens.push("Longitude é obrigatória.");
    return mensagens;
  },

  async listarPorCpfCnpj(cpfCnpj) {
    return await Oficina
      .findOne({
        cpfCnpj,
      })
      .catch(erro => {
        oficina = null;
      });
  },

  async listarPorEmail(email) {
    return await Oficina
      .findOne({
        email,
      })
      .catch(erro => {
        console.log(erro);
      });
  },

  async inserir(oficina) {
    return await Oficina
      .create(oficina)
      .catch(erro => {
        console.log(erro);
      });
  },

}