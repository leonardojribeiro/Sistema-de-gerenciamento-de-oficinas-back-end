const validacao = require("../util/validacao");
const servicoValidacao = require("./servicoValidacao");
const Fornecedor = require('../models/Fornecedor');

module.exports = class FornecedorServices {
  validarFornecedorASerInserido(informacoesDoFornecedor) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoFornecedor.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(informacoesDoFornecedor.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFornecedor.email) &&
      !validacao.validarEmail(informacoesDoFornecedor.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFornecedor.endereco));
    return mensagens;
  }

  validarFornecedorASerAlterado(informacoesDoFornecedor) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoFornecedor.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(informacoesDoFornecedor.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFornecedor.email) &&
      !validacao.validarEmail(informacoesDoFornecedor.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFornecedor.endereco));
    mensagens.push(...servicoValidacao.validarIdDoFornecedor(informacoesDoFornecedor._id))
    return mensagens;
  }

  async contarFornecedoresPorCpfCnpjEIdOficina(informacoesDoFornecedor) {
    return await Fornecedor
      .countDocuments({
        cpfCnpj: informacoesDoFornecedor.cpfCnpj,
        idOficina: informacoesDoFornecedor.idOficina,
      })
      .catch(erro => console.log(erro))
  }

  async inserirFornecedor(informacoesDoFornecedor){
    return await Fornecedor
    .create(informacoesDoFornecedor)
    .catch(erro=>console.log(erro));
  }

  async listarPorIdOficina(idOficina){
    return await Fornecedor
    .find({
      idOficina
    })
    .catch(erro => console.log(erro))
  }

  async listarPorIdFornecedorEIdOficina(informacoesDoFornecedor){
    return await Fornecedor
    .findOne(informacoesDoFornecedor)
    .catch(erro => console.log(erro))
  }

  async alterarFornecedor(informacoesDoFornecedor){
    return await Fornecedor
    .updateOne(
      {
        _id: informacoesDoFornecedor._id,
      },
      {
        $set: informacoesDoFornecedor
      }
    )
    .catch(erro => console.log(erro))
  }
}