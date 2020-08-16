const FuncionarioServices = require('../services/FuncionarioServices');
const servicoValidacao = require('../services/servicoValidacao');
const funcionarioServices = new FuncionarioServices();


module.exports = {
  async inserirFuncionario(requisicao, resposta) {
    const { idOficina } = requisicao
    const {
      nome,
      sexo,
      cpf,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      idsEspecialidades,
      endereco,
    } = requisicao.body;
    const funcionarioASerInserido = {
      nome,
      sexo,
      cpf,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      idsEspecialidades,
      endereco,
      idOficina,
    };
    const mensagens = funcionarioServices.validarFuncionarioASerInserido(funcionarioASerInserido);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const funcionarioExistenteNaOficina = await funcionarioServices.contarFuncionariosPorCpfEIdOficina(funcionarioASerInserido);
    console.log(funcionarioExistenteNaOficina)
    if (funcionarioExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Funcionário já cadastrado."
        });
    }
    const clienteInserido = await funcionarioServices.inserirFuncionario(funcionarioASerInserido);
    if (!clienteInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Funcionário não cadastrado."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Funcionário cadastrado com sucesso."
      });
  },

  async listarTodos(requisicao, resposta) {
    const { idOficina } = requisicao;
    const funcionariosListados = await funcionarioServices.listarPorIdOficina(idOficina);
    if (!funcionariosListados) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar clientes."
        });
    }
    return resposta.json(funcionariosListados)
  },

  async listarPorId(requisicao, resposta) {
    const idOficina = requisicao.idOficina
    const {_id } = requisicao.query;
    const informacoesDoFuncionario = { idOficina, _id };
    const mensagens = servicoValidacao.validarIdDoFuncionario(_id);
    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    const funcionarioListado = await funcionarioServices.listarPorIdFuncionarioEIdOficina(informacoesDoFuncionario);
    if (!funcionarioListado) {
      return resposta
        .status(500)
        .json({
          mensagem: "Erro ao listar funcionário."
        });
    }
    return resposta.json(funcionarioListado[0]);
  },

  async alterarFuncionario(requisicao, resposta) {
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
