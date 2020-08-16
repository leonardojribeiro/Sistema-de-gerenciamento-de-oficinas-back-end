const FornecedorServices = require("../services/FornecedorServices");
const servicoValidacao = require("../services/servicoValidacao");
const fornecedorServices = new FornecedorServices();

module.exports = {
  async inserirFornecedor(requisicao, resposta) {
    const { idOficina } = requisicao;
    const {
      nomeFantasia,
      razaoSocial,
      cpfCnpj,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    } = requisicao.body;
    const fornecedorASerInserido = {
      nomeFantasia,
      razaoSocial,
      cpfCnpj,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    };
    console.log(fornecedorASerInserido)
    const mensagens = fornecedorServices.validarFornecedorASerInserido(fornecedorASerInserido);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const fornecedorExistenteNaOficina = await fornecedorServices.contarFornecedoresPorCpfCnpjEIdOficina(fornecedorASerInserido);
    console.log(fornecedorExistenteNaOficina)
    if (fornecedorExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Fornecedor já cadastrado."
        });
    }
    const fornecedorInserido = await fornecedorServices.inserirFornecedor(fornecedorASerInserido);
    if (!fornecedorInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Fornecedor não cadastrado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Fornecedor cadastrado com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao;
    const fornecedoesListados = await fornecedorServices.listarPorIdOficina(idOficina);
    if (!fornecedoesListados) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar fornecedor."
        });
    }
    return resposta.json(fornecedoesListados)
  },

  async listarPorId(requisicao, resposta) {
    const { idOficina } = requisicao;
    const { _id } = requisicao.query;
    const informacoesDoFornecedor = { idOficina, _id };
    const mensagens = servicoValidacao.validarIdDoFornecedor(_id)
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const fornecedorListado = await fornecedorServices.listarPorIdFornecedorEIdOficina(informacoesDoFornecedor);
    if (!fornecedorListado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar fornecedor."
        });
    }
    return resposta.json(fornecedorListado);
  },

  async alterarFornecedor(requisicao, resposta) {
    const {
      _id,
      cpfCnpj,
      nomeFantasia,
      razaoSocial,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    } = requisicao.body;
    const FornecedorASerAlterado = {
      _id,
      cpfCnpj,
      nomeFantasia,
      razaoSocial,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    };
    const mensagens = fornecedorServices.validarFornecedorASerAlterado(FornecedorASerAlterado);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const clienteInserido = await fornecedorServices.alterarFornecedor(FornecedorASerAlterado);
    if (!clienteInserido.nModified) {
      return resposta.status(500)
        .json({
          mensagem: "Fornecedor não alterado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Fornecedor alterado com sucesso."
      });
  }

}