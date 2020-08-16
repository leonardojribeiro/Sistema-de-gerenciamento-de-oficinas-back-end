import FornecedorServices from "../services/FornecedorServices";
import servicoValidacao from "../services/servicoValidacao";
import { Request, Response } from "express";
import { IEndereco } from "../models/Endereco";
import { IFornecedor } from "../models/Fornecedor";
const fornecedorServices = new FornecedorServices();

export default class FornecedorContoller {
  async inserirFornecedor(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina;
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
      } as IFornecedor
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
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    try {
      const fornecedoesListados = await fornecedorServices.listarPorIdOficina(idOficina);
      if (!fornecedoesListados) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar fornecedor."
          });
      }
      return resposta.json(fornecedoesListados);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoFornecedor = {
        idOficina,
        _id
      } as IFornecedor;
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