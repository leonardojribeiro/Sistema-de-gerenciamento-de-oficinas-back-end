const validacao = require("../util/validacao");
const Cliente = require("../models/Cliente");
const servicoValidacao = require("./servicoValidacao");
const { listarPorIdOficina } = require("./marcaServices");

module.exports = class ClienteServices {
  validarClienteASerInserido(cliente) {
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
    !validacao.validarTexto(cliente.endereco.bairro) && mensagens.push("Bairro é obrigatório.");
    !validacao.validarTexto(cliente.endereco.cep) && mensagens.push("CEP é obrigatório.")
      || !validacao.validarCep(cliente.endereco.cep) && mensagens.push("CEP inválido.");
    !validacao.validarTexto(cliente.endereco.cidade) && mensagens.push("Cidade é obrigatória.");
    !validacao.validarTexto(cliente.endereco.estado) && mensagens.push("Estado é obrigatório");
    mensagens.push(...servicoValidacao.validarIdDaOficina(cliente.idOficina));
    return mensagens;
  }

  validarIdDaOficina(idOficina) {
    return servicoValidacao.validarIdDaOficina(idOficina);
  }

  validarIdDoCLienteEIdDaOficina(informacoesDoCliente) {
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoCliente._id));
    mensagens.push(...this.validarIdDaOficina(informacoesDoCliente.idOficina));
    return mensagens
  }

  validarClienteASerAlterado(cliente) {
    const mensagens = [];
    !validacao.validarTexto(cliente.nome) && mensagens.push("Nome é obrigatório."); 
    !validacao.validarTexto(cliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    validacao.validarTexto(cliente.telefoneFixo) &&
      !validacao.validarTelefone(cliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(cliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(cliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(cliente.email) &&
      !validacao.validarTexto(cliente.email) && !validacao.validarEmail(cliente.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(cliente.endereco));
    return mensagens;
  }

  async inserir(cliente) {
    return await Cliente
      .create(cliente)
      .catch(erro => console.log(erro));
  }

  async contarClientesPorCpfEIdOficina(cliente) {
    return await Cliente
      .countDocuments({
        cpfCnpj: cliente.cpfCnpj,
        idOficina: cliente.idOficina,
      })
      .catch(erro => console.log(erro))
  }

  async listarPorIdOficina(idOficina) {
    return await Cliente
      .find({
        idOficina
      })
      .catch(erro => console.log(erro))
  }

  async listarPorIdClienteEIdOficina(informacoesDoCliente) {
    return await Cliente
      .findOne(informacoesDoCliente)
      .select({
        idOficina: 0,
        __v: 0,

      })
      .catch(erro => console.log(erro))
  }

  async alterarCliente(cliente) {
    return await Cliente
      .updateOne(
        {
          _id: cliente._id
        },
        {
          $set: cliente,
        },

      )
      .catch(erro => console.log(erro))
  }
}