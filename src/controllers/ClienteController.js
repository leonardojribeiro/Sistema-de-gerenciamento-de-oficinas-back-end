const ClienteServices = require("../services/ClienteServices");
const servicoValidacao = require("../services/servicoValidacao");

const clienteServices = new ClienteServices();

module.exports = {
  async inserirCliente(requisicao, resposta) {
    const { idOficina } = requisicao;
    const {
      nome,
      sexo,
      cpfCnpj,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    } = requisicao.body;
    const clienteASerInserido = {
      nome,
      sexo,
      cpfCnpj,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
      idOficina,
    };
    const mensagens = clienteServices.validarClienteASerInserido(clienteASerInserido);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const clienteExistenteNaOficina = await clienteServices.contarClientesPorCpfEIdOficina(clienteASerInserido);
    console.log(clienteExistenteNaOficina)
    if (clienteExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Cliente já cadastrado."
        });
    }
    const clienteInserido = await clienteServices.inserirCliente(clienteASerInserido);
    if (!clienteInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Cliente não cadastrado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Cliente cadastrado com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao;
    const clientesListados = await clienteServices.listarPorIdOficina(idOficina);
    if (!clientesListados) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar clientes."
        });
    }
    return resposta.json(clientesListados)
  },

  async listarPorId(requisicao, resposta) {
    const { idOficina } = requisicao;
    const { _id } = requisicao.query;
    const informacoesDoCliente = { idOficina, _id };
    const mensagens = servicoValidacao.validarIdDoCliente(_id);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const clienteListado = await clienteServices.listarPorIdClienteEIdOficina(informacoesDoCliente);
    if (!clienteListado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar clientes."
        });
    }
    return resposta.json(clienteListado);
  },

  async alterarCliente(requisicao, resposta) {
    const {
      _id,
      nome,
      sexo,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    } = requisicao.body;
    const clienteASerAlterado = {
      _id,
      nome,
      sexo,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
    };
    const mensagens = clienteServices.validarClienteASerAlterado(clienteASerAlterado);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const clienteInserido = await clienteServices.alterarCliente(clienteASerAlterado);
    if (!clienteInserido.nModified) {
      return resposta.status(500)
        .json({
          mensagem: "Cliente não alterado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Cliente alterado com sucesso."
      });
  }

}