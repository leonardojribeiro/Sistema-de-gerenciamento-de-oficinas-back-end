const validacao = require("../util/validacao");
const Cliente = require("../models/Cliente");
const servicoValidacao = require("./servicoValidacao");
const { listarPorIdOficina } = require("./MarcaServices");

module.exports = class ClienteServices {
  validarClienteASerInserido(informacoesDoCliente) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoCliente.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarTexto(informacoesDoCliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    !validacao.validarTexto(informacoesDoCliente.cpfCnpj) && mensagens.push("CPF/CNPJ é obrigatório.")
      || !validacao.validarCpfCnpj(informacoesDoCliente.cpfCnpj) && mensagens.push("CPF/CNPJ inválido");
    validacao.validarTexto(informacoesDoCliente.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoCliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoCliente.email) &&
       !validacao.validarEmail(informacoesDoCliente.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoCliente.endereco));
    mensagens.push(...this.validarIdDaOficina(informacoesDoCliente.idOficina));
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

  validarClienteASerAlterado(informacoesDoCliente) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoCliente.nome) && mensagens.push("Nome é obrigatório."); 
    !validacao.validarTexto(informacoesDoCliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    validacao.validarTexto(informacoesDoCliente.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoCliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoCliente.email) &&
      !validacao.validarTexto(informacoesDoCliente.email) && !validacao.validarEmail(informacoesDoCliente.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoCliente.endereco));
    return mensagens;
  }

  async inserirCliente(informacoesDoCliente) {
    return await Cliente
      .create(informacoesDoCliente)
      .catch(erro => console.log(erro));
  }

  async contarClientesPorCpfEIdOficina(informacoesDoCliente) {
    return await Cliente
      .countDocuments({
        cpfCnpj: informacoesDoCliente.cpfCnpj,
        idOficina: informacoesDoCliente.idOficina,
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

  async alterarCliente(informacoesDoCliente) {
    return await Cliente
      .updateOne(
        {
          _id: informacoesDoCliente._id
        },
        {
          $set: informacoesDoCliente,
        },

      )
      .catch(erro => console.log(erro))
  }
}