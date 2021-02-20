import ClienteServices from "../services/ClienteServices";
import servicoValidacao from "../services/servicoValidacao";
import { Response, Request } from "express";
import { ICliente } from "../models/Cliente";
import { IEndereco } from "../models/Endereco";
import { replaceNoNumeric } from "../util/Replace";
import { sendMessageTo } from "../Socket";

const clienteServices = new ClienteServices();

export default class ClienteController {
  async incluirCliente(requisicao: Request, resposta: Response) {
    try {
      const oficina = requisicao.body.oficina as string;
      const nome = requisicao.body.nome as string;
      const sexo = requisicao.body.sexo as string;
      const cpfCnpj = replaceNoNumeric(requisicao.body.cpfCnpj as string);
      const dataNascimento = requisicao.body.dataNascimento as Date;
      const telefoneFixo = replaceNoNumeric(requisicao.body.telefoneFixo as string);
      const telefoneCelular = replaceNoNumeric(requisicao.body.telefoneCelular as string);
      const email = requisicao.body.email as string;
      const endereco = requisicao.body.endereco as IEndereco;
      const clienteASerInserido = {
        nome,
        sexo,
        cpfCnpj,
        dataNascimento,
        telefoneFixo,
        telefoneCelular,
        email,
        endereco,
        oficina,
      } as ICliente;
      const mensagens = clienteServices.validarClienteASerIncluido(clienteASerInserido);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const clienteExistenteNaOficina = await clienteServices.contarClientesPorCpfEIdOficina(clienteASerInserido);
      if (clienteExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Cliente já cadastrado."
          });
      }
      const clienteInserido = await clienteServices.incluirCliente(clienteASerInserido);
      if (!clienteInserido) {
        return resposta.status(500)
          .json({
            mensagem: "Cliente não cadastrado."
          });
      }
      sendMessageTo(oficina, 'clienteIncluido', clienteInserido);
      return resposta.status(201)
        .json({
          mensagem: "Cliente cadastrado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    try {
      const oficina = requisicao.body.oficina as string;
      const pular = Number(requisicao.query.pular);
      const limite = Number(requisicao.query.limite);
      const clientes = await clienteServices.listarPorOficina(oficina, pular, limite);
      const total = await clienteServices.contarPorOficina(oficina);
      if (!clientes) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      return resposta.json({
        itens: clientes,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    try {
      const oficina = requisicao.body.oficina as string;
      const _id = requisicao.query._id as string;
      const mensagens = servicoValidacao.validarIdDoCliente(_id);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const clienteListado = await clienteServices.listarPorIdClienteEIdOficina(oficina, _id);
      if (!clienteListado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      return resposta.json(clienteListado);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async consultarClientes(requisicao: Request, resposta: Response) {
    try {
      const oficina = requisicao.body.oficina as string;
      const pular = Number(requisicao.query.pular);
      const limite = Number(requisicao.query.limite);
      const nome = requisicao.query.nome as string;
      const cpfCnpj = replaceNoNumeric(requisicao.query.cpfCnpj as string);
      const email = requisicao.query.email as string;
      const telefone = replaceNoNumeric(requisicao.query.telefone as string);
      const clientes = await clienteServices.consultar(oficina, { nome, cpfCnpj, email, telefone }, pular, limite);
      const total = await clienteServices.contarPorConsulta(oficina, { nome, cpfCnpj, email, telefone });
      if (!clientes) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      return resposta.json({
        itens: clientes,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarCliente(requisicao: Request, resposta: Response) {
    try {
      const _id = requisicao.body._id as string;
      const nome = requisicao.body.nome as string;
      const sexo = requisicao.body.sexo as string;
      const dataNascimento = requisicao.body.dataNascimento as Date;
      const telefoneFixo = replaceNoNumeric(requisicao.body.telefoneFixo as string);
      const telefoneCelular = replaceNoNumeric(requisicao.body.telefoneCelular as string);
      const email = requisicao.body.email as string;
      const endereco = requisicao.body.endereco as IEndereco;
      const clienteASerAlterado = {
        _id,
        nome,
        sexo,
        dataNascimento,
        telefoneFixo: replaceNoNumeric(telefoneFixo),
        telefoneCelular: replaceNoNumeric(telefoneCelular),
        email,
        endereco,
      } as ICliente
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
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}