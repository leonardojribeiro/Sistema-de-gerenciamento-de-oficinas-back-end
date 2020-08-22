import { Request, Response } from "express";
import PecaServices from '../services/PecaServices';
import servicoValidacao from '../services/servicoValidacao';
import { IPeca } from "../models/Peca";
const pecaServices = new PecaServices();

export default class PecaController {

  async inserirPeca(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.body.descricao as string;
    const marca = requisicao.body.marca as string;
    try {
      const pecaASerInserida = {
        descricao,
        marca,
        oficina,
      } as IPeca;
      const mensagens = pecaServices.validarPecaASerAlterada(pecaASerInserida);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const pecaExistenteNaOficina = await pecaServices.contarPorDescricaoDaPecaIdMarcaEIdOficina(pecaASerInserida);
      if (pecaExistenteNaOficina) {
        return resposta
          .status(406)
          .json({
            mensagem: "Essa peça já está cadastrada"
          });
      }
      const pecaInserida = await pecaServices.inserir(pecaASerInserida);
      if (!pecaInserida) {
        return resposta
          .status(500)
          .json({
            mensagem: "Peça não cadastrada."
          });
      }
      return resposta
        .status(201)
        .json({
          mensagem: "Peça cadastrada com sucesso."
        });
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    try {
      const modelos = await pecaServices.listarPorIdOficina(oficina);
      return resposta.json(modelos);
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }

  async listarPecaPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDaPeca = {
        _id,
        oficina,
      } as IPeca;
      const mensagens = servicoValidacao.validarIdDaPeca(_id);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const pecaListada = await pecaServices.listarPorIdOficinaEIdPeca(informacoesDaPeca);
      if (!pecaListada) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar modelo."
          });
      }
      return resposta.json(pecaListada);
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }

  async consultar(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const consulta = requisicao.query.consulta as string;
    const tipo = requisicao.query.tipo as string;
    try {
      const informacoesDaConsulta = {
        oficina,
        consulta,
        tipo
      };
      const mensagens = pecaServices.validarInformacoesDaConsulta(informacoesDaConsulta);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const pecasListadas = await pecaServices.consultar(informacoesDaConsulta);
      if (!pecasListadas) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar marca."
          });
      }
      return resposta.json(pecasListadas);
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }

  async alterarPeca(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const descricao = requisicao.body.descricao as string;
    const marca = requisicao.body.marca as string;
    try {
      const pecaASerAlterada = {
        _id,
        descricao,
        marca,
      } as IPeca;
      const mensagens = pecaServices.validarPecaASerAlterada(pecaASerAlterada);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const resultado = await pecaServices.alterarPeca(pecaASerAlterada);
      if (!resultado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Peça não alterada."
          });
      }
      return resposta.status(201).json({ mensagem: "Peça alterada com sucesso." });
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }
}