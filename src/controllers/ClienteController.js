const clienteServices = require("../services/clienteServices");


module.exports = class ClienteController {
  async inserirDadosDeCliente(requisicao, resposta) {
    const {
      nome,
      sexo,
      cpfCnpj,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      logradouro,
      numero,
      bairro,
      cep,
      complemento,
      cidade,
      estado,
      idOficina,
    } = requisicao.body;

    const clienteASerInserido = {
      nome,
      sexo,
      cpfCnpj,
      dataNascimento,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco: {
        logradouro,
        numero,
        bairro,
        cep,
        complemento,
        cidade,
        estado,
      },
      idOficina,
    };

    const mensagens = clienteServices.validar(clienteASerInserido);

    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    const clienteExistenteNaOficina = await clienteServices.contarClientesPorCpfEIdOficina(clienteASerInserido);

    if(clienteExistenteNaOficina){
      return resposta.status(406)
        .json({
          mensagem: "Cliente já cadastrado."
        });
    }

    const clienteInserido = await clienteServices.inserir(clienteASerInserido);

    if(!clienteInserido){
      return resposta.status(500)
        .json({
          mensagem: "Cliente não cadastrado."
        });
    }

    return resposta.status(201)
      .json({
        mensagem: "Cliente cadastrado com sucesso."
      });
  }
}