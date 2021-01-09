import EspecialidadeServices from '../services/EspecialidadeServices';
import servicoValidacao from '../services/servicoValidacao';
import { Request, Response } from 'express';
import { IEspecialidade } from '../models/Especialidade';

const especialidadeServices = new EspecialidadeServices();

export default class EspecialidadeController {
  async incluirEspecialidade(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.body.descricao as string;
    try {
      const especialidadeASerInserida = {
        descricao,
        oficina,
      } as IEspecialidade;
      const mensagens = especialidadeServices.validarEspecialidadeASerIncluida(especialidadeASerInserida);
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
      const especialidadeInserida = await especialidadeServices.incluirEspecialidade(especialidadeASerInserida);
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
    const pular = Number(requisicao.query.pular);
    const limite = Number(requisicao.query.limite);
    const oficina = requisicao.body.oficina as string;
    try {
      const especialidades = await especialidadeServices.listarPorOficina(oficina, pular, limite);
      const total = await especialidadeServices.contarPorOficina(oficina);
      return resposta.json({
        itens: especialidades,
        total,
      });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async consultarEspecialidades(requisicao: Request, resposta: Response) {
    const pular = Number(requisicao.query.pular);
    const limite = Number(requisicao.query.limite);
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.query.descricao as string
    try {
      const especialidades = await especialidadeServices.consultar(oficina, descricao, pular, limite);
      const total = await especialidadeServices.contarPorConsulta(oficina, descricao);
      return resposta.json({
        itens: especialidades,
        total,
      });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarEspecialidadePorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const mensagens = servicoValidacao.validarIdDaEspecialidade(_id)
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const especialidadeListada = await especialidadeServices.listarPorIdEspecialidadeEIdOficina(oficina, _id);
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