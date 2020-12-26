import ClienteServices from "../services/ClienteServices";
import servicoValidacao from "../services/servicoValidacao";
import { Response, Request } from "express";
import { ICliente } from "../models/Cliente";
import { IEndereco } from "../models/Endereco";
import validacao from "../util/validacao";
import { replaceNoNumeric } from "../util/Replace";

const clienteServices = new ClienteServices();

export default class ClienteController {
  async inserirCliente(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const nome = requisicao.body.nome as string;
    const sexo = requisicao.body.sexo as string;
    const cpfCnpj = requisicao.body.cpfCnpj as string;
    const dataNascimento = requisicao.body.dataNascimento as Date;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    try {
      const clienteASerInserido = {
        nome,
        sexo,
        cpfCnpj: replaceNoNumeric(cpfCnpj),
        dataNascimento,
        telefoneFixo: replaceNoNumeric(telefoneFixo),
        telefoneCelular: replaceNoNumeric(telefoneCelular),
        email,
        endereco,
        oficina,
      } as ICliente;
      const mensagens = clienteServices.validarClienteASerInserido(clienteASerInserido);
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
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pular = Number(requisicao.query.pular);
    const limite = Number(requisicao.query.limite);

    try {
      const clientes = await clienteServices.listarPorOficina(oficina, pular, limite);
      const total = await clienteServices.contarPorOficina(oficina);
      if (!clientes) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      console.log(pular)
      return resposta.json({
        clientes,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoCliente = {
        oficina,
        _id
      } as ICliente;
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
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async consultar(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pular = Number(requisicao.query.pular);
    const limite = Number(requisicao.query.limite);
    const nome = requisicao.query.nome as string;
    let cpfCnpj = requisicao.query.cpfCnpj as string | undefined;
    const email = requisicao.query.email as string;
    let telefone = requisicao.query.telefone as string | undefined;
    try {
      cpfCnpj = replaceNoNumeric(cpfCnpj);
      telefone = replaceNoNumeric(telefone);
      const clientes = await clienteServices.consultar(oficina, nome, cpfCnpj, email, telefone, pular, limite);
      const total = await clienteServices.contarPorConsulta(oficina, nome, cpfCnpj, email, telefone);
      if (!clientes) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      return resposta.json({
        clientes,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarCliente(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const nome = requisicao.body.nome as string;
    const sexo = requisicao.body.sexo as string;
    const dataNascimento = requisicao.body.dataNascimento as Date;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    console.log(telefoneFixo, replaceNoNumeric(telefoneFixo))
    try {
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