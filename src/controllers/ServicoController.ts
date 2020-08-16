import ServicoServices from "../services/ServicosServices";
import { Response, Request } from "express";
import { IServico } from "../models/Servico";
import servicoValidacao from "../services/servicoValidacao";
const servicoServices = new ServicoServices();
export default class ServicoController{
  async inserirServico(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const descricao = requisicao.body.descricao as string;
    const tempoDuracao = requisicao.body.tempoDuracao as number;
    const valor = requisicao.body.valor as number;
    try {
      const informacoesDoServico = {
        descricao,
        tempoDuracao,
        valor,
        idOficina,
      } as IServico
      const mensagens = servicoServices.validarServico(informacoesDoServico);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const servicoExistenteNaOficina = await servicoServices.contarServicosPorDescricaoEIdOficina(informacoesDoServico);
      if (servicoExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Serviço já cadastrado."
          });
      }
      const servicoInserido = await servicoServices.inserirServico(informacoesDoServico);
      if (!servicoInserido) {
        return resposta.status(500)
          .json({
            mensagem: "Serviço não cadastrado."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Serviço cadastrado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro)
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    try {
      const servicosListados = await servicoServices.listarPorIdOficina(idOficina);
      if (!servicosListados) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar serviços."
          });
      }
      return resposta.json(servicosListados)
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
      const informacoesDoServico = {
        idOficina,
        _id
      } as IServico;
      const mensagens = servicoValidacao.validarIdDoServico(_id);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const servicoListado = await servicoServices.listarPorIdServicoEIdOficina(informacoesDoServico);
      if (!servicoListado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar serviço."
          });
      }
      return resposta.json(servicoListado);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarServico(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.body._id as string;
    const descricao = requisicao.body.descricao as string;
    const tempoDuracao = requisicao.body.tempoDuracao as number;
    const valor = requisicao.body.valor as number;
    try {
      const informacoesDoServico = {
        descricao,
        tempoDuracao,
        valor,
        idOficina,
        _id,
      } as IServico
      const mensagens = servicoServices.validarServicoASerAlterado(informacoesDoServico);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const servicoExistenteNaOficina = await servicoServices.contarServicosPorDescricaoEIdOficina(informacoesDoServico);
      if (servicoExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Serviço já cadastrado."
          });
      }
      const result = await servicoServices.alterarServico(informacoesDoServico);
      if (!result.nModified) {
        return resposta.status(500)
          .json({
            mensagem: "Serviço não alterado."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Serviço alterado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

}