import { Request, Response } from "express";
import PecaServices from '../services/PecaServices';
import servicoValidacao from '../services/servicoValidacao';
import { IPeca } from "../models/Peca";
import { Types } from "mongoose";
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
    const page = requisicao.query.page as string;
    const limit = requisicao.query.limit as string;

    try {
      if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
        return resposta.status(400).send();
      }
      const skip = (Number(page) - 1) * Number(limit);
      const total = await pecaServices.contarPorOficina(oficina);
      const pecas = await pecaServices.listarPorOficina(oficina, Number(limit), skip);
      return resposta.json({
        pecas,
        total,
      });
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
            mensagem: "Erro ao listar peça."
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
    const marca = requisicao.query.marca as string;
    const page = requisicao.query.page as string;
    const limit = requisicao.query.limit as string;
    try {
      if (!page || !limit || Number(page) < 1 || Number(limit) < 1 || (marca && !Types.ObjectId.isValid(marca))) {
        return resposta.status(400).send();
      }
      const skip = (Number(page) - 1) * Number(limit);
      const pecas = await pecaServices.consultar(consulta, marca, oficina, Number(limit), skip, false);
      const total = await pecaServices.consultar(consulta, marca, oficina, Number(limit), skip, true);
      if (!pecas) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar peças."
          });
      }
      return resposta.json({
        pecas,
        total
      });
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