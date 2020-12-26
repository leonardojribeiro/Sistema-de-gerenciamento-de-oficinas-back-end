import { Request, Response } from "express";
import PecaServices from '../services/PecaServices';
import servicoValidacao from '../services/servicoValidacao';
import { IPeca } from "../models/Peca";
import { Types } from "mongoose";
import validacao from "../util/validacao";
const pecaServices = new PecaServices();

export default class PecaController {

  async incluirPeca(requisicao: Request, resposta: Response) {
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
      const pecaInserida = await pecaServices.incluirPeca(pecaASerInserida);
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
    const pagina = Number(requisicao.query.pagina);
    const limite = Number(requisicao.query.limite);
    try {
      if (!validacao.validarPaginacao(pagina, limite)) {
        return resposta.status(400).send();
      }
      const pular = (pagina - 1) * limite;
      const total = await pecaServices.contarPorOficina(oficina);
      const pecas = await pecaServices.listarPorOficina(oficina, pular, limite);
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

  async consultarPecas(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.query.descricao as string;
    const marca = requisicao.query.marca as string;
    const pagina = Number(requisicao.query.pagina);
    const limite = Number(requisicao.query.limite);
    try {
      if (!validacao.validarPaginacao(pagina, limite) || (marca && !Types.ObjectId.isValid(marca))) {
        return resposta.status(400).send();
      }
      const pular = (pagina - 1) * limite;
      const pecas = await pecaServices.consultar(oficina, descricao, marca, pular, limite,);
      const total = await pecaServices.contarPorConsulta(oficina, descricao, marca,);
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