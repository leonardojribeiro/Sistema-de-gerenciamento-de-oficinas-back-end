import EspecialidadeServices from '../services/EspecialidadeServices';
import servicoValidacao from '../services/servicoValidacao';
import { Request, Response } from 'express';
import { IEspecialidade } from '../models/Especialidade';

const especialidadeServices = new EspecialidadeServices();

export default class EspecialidadeController {
  async inserirEspecialidade(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const descricao = requisicao.body.descricao as string;
    try {
      const especialidadeASerInserida = {
        descricao,
        idOficina,
      } as IEspecialidade;
      const mensagens = especialidadeServices.validarEspecialidadeASerInserida(especialidadeASerInserida);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      };
      const especialidadeExistenteNaOficina = await especialidadeServices.contarPorDescricaoEIdOficina(especialidadeASerInserida);
      if (especialidadeExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Especialidade já cadastrada."
          });
      }
      const especialidadeInserida = await especialidadeServices.inserir(especialidadeASerInserida);
      if (!especialidadeInserida) {
        return resposta.status(500)
          .json({
            mensagem: "Especialidade não cadastrada."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Especialidade cadastrada com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    try {
      const idOficina = requisicao.body.idOficina as string;
      const modelos = await especialidadeServices.listarPorIdOficina(idOficina);
      return resposta.json(modelos);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarEspecialidadePorId(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDaEspecialidade = {
        _id,
        idOficina,
      } as IEspecialidade
      const mensagens = servicoValidacao.validarIdDaEspecialidade(_id)
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const especialidadeListada = await especialidadeServices.listarPorIdEspecialidadeEIdOficina(informacoesDaEspecialidade);
      if (!especialidadeListada) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar especialidade."
          });
      }
      return resposta.json(especialidadeListada);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarEspecialidade(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const descricao = requisicao.body.descricao as string;
    try {
      const especialidadeASerAlterada = {
        _id,
        descricao,
      } as IEspecialidade;
      const mensagens = especialidadeServices.validarEspecialidadeASerAlterada(especialidadeASerAlterada);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const resultado = especialidadeServices.alterarEspecialidade(especialidadeASerAlterada);
      if (!resultado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Especialidade não alterada."
          });
      }
      return resposta
        .status(201)
        .json({ mensagem: "Especialidade alterada com sucesso." });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
};