import FornecedorServices from "../services/FornecedorServices";
import servicoValidacao from "../services/servicoValidacao";
import { Request, Response } from "express";
import { IEndereco } from "../models/Endereco";
import { IFornecedor } from "../models/Fornecedor";
import validacao from "../util/validacao";
const fornecedorServices = new FornecedorServices();

export default class FornecedorContoller {
  async incluirFornecedor(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina;
    const nomeFantasia = requisicao.body.nomeFantasia as string;
    const razaoSocial = requisicao.body.razaoSocial as string;
    const cpfCnpj = requisicao.body.cpfCnpj as string;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    try {
      const fornecedorASerInserido = {
        nomeFantasia,
        razaoSocial,
        cpfCnpj,
        telefoneFixo,
        telefoneCelular,
        email,
        endereco,
        oficina,
      } as IFornecedor
      const mensagens = fornecedorServices.validarFornecedorASerIncluido(fornecedorASerInserido);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const fornecedorExistenteNaOficina = await fornecedorServices.contarFornecedoresPorCpfCnpjEIdOficina(fornecedorASerInserido);
      if (fornecedorExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Fornecedor já cadastrado."
          });
      }
      const fornecedorInserido = await fornecedorServices.incluirFornecedor(fornecedorASerInserido);
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
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pagina = Number(requisicao.query.pagina);
    const limite = Number(requisicao.query.limite);
    try {
      if (!validacao.validarPaginacao(pagina, limite)) {
        return resposta.status(400).send();
      }
      const pular = (pagina - 1) * limite;
      const fornecedores = await fornecedorServices.listarPorOficina(oficina, pular, limite);
      const total = await fornecedorServices.contarPorOficina(oficina);
      if (!fornecedores) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar fornecedores."
          });
      }
      return resposta.json({
        itens: fornecedores,
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
      const mensagens = servicoValidacao.validarIdDoFornecedor(_id)
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const fornecedorListado = await fornecedorServices.listarPorIdFornecedorEIdOficina(oficina, _id);
      if (!fornecedorListado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar fornecedor."
          });
      }
      return resposta.json(fornecedorListado);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarFornecedor(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const cpfCnpj = requisicao.body.cpfCnpj as string;
    const nomeFantasia = requisicao.body.nomeFantasia as string;
    const razaoSocial = requisicao.body.razaoSocial as string;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    try {
      const FornecedorASerAlterado = {
        _id,
        cpfCnpj,
        nomeFantasia,
        razaoSocial,
        telefoneFixo,
        telefoneCelular,
        email,
        endereco,
      } as IFornecedor;
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
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}