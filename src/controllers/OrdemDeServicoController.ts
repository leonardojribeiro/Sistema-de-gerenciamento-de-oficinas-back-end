import { Request, Response } from "express";
import { IItemDeServico } from "../models/ItemDeServico";
import { IItemDePeca } from "../models/ItemDePeca";
import OrdemDeServico, { IOrdemDeServico } from "../models/OrdemDeServico";
import OrdemDeServicoServices from "../services/OrdemDeServicoServices";
import validacao from "../util/validacao";

const ordemDeServicoServices = new OrdemDeServicoServices();

export default class OrdemDeServicoContoller {

  async incluirOrdemDeServico(requisicao: Request, resposta: Response) {
    const dataDeRegistro = requisicao.body.dataDeRegistro as Date;
    const dataDeInicio = requisicao.body.dataDeInicio as Date;
    const dataDeConclusao = requisicao.body.dataDeConclusao as Date;
    const andamento = requisicao.body.andamento as number;
    const desconto = requisicao.body.desconto as number; 
    const categoria = requisicao.body.categoria as string;
    const status = requisicao.body.status as string;
    const sintoma = requisicao.body.sintoma as string;
    const itensDeServico = requisicao.body.itensDeServico as IItemDeServico[];
    const itensDePeca = requisicao.body.itensDePeca as IItemDePeca[];
    const veiculo = requisicao.body.veiculo as string;
    const oficina = requisicao.body.oficina as string;
    try {
      const informacoesDaOrdemDeServico = {
        dataDeRegistro,
        dataDeInicio,
        dataDeConclusao,
        andamento,
        desconto,
        categoria,
        status,
        sintoma,
        itensDeServico,
        itensDePeca,
        veiculo,
        oficina,
      } as IOrdemDeServico;
      const mensagens = ordemDeServicoServices.validarOrdemDeServico(informacoesDaOrdemDeServico);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      let valorTotal = 0.00;
      let valorTotalDasPecas = 0.00;
      let valorTotalDosServicos = 0.00;
      informacoesDaOrdemDeServico.itensDePeca.forEach((itemDePeca) => {
        valorTotalDasPecas += (itemDePeca.valorUnitario * itemDePeca.quantidade)
      });
      informacoesDaOrdemDeServico.itensDeServico.forEach((itemDeServico) => {
        valorTotalDosServicos += (itemDeServico.valorUnitario * itemDeServico.quantidade)
      });
      valorTotal = valorTotalDasPecas + valorTotalDosServicos;
      informacoesDaOrdemDeServico.valorTotalDasPecas = valorTotalDasPecas;
      informacoesDaOrdemDeServico.valorTotalDosServicos = valorTotalDosServicos;
      informacoesDaOrdemDeServico.valorTotal = valorTotal;
      const ordemDeServicoIncluida = await ordemDeServicoServices.incluirOrdemDeServico(informacoesDaOrdemDeServico);
      if (!ordemDeServicoIncluida) {
        return resposta
          .status(500)
          .json({
            mensagem: "Ordem de serviço não cadastrada."
          });
      }
      return resposta
        .status(201)
        .json({
          mensagem: "Ordem de serviço cadastrada com sucesso!"
        })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarOrdemDeServico(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const dataDeRegistro = requisicao.body.dataDeRegistro as Date;
    const dataDeInicio = requisicao.body.dataDeInicio as Date;
    const dataDeConclusao = requisicao.body.dataDeConclusao as Date;
    const andamento = requisicao.body.andamento as number;
    const desconto = requisicao.body.desconto as number;
    const categoria = requisicao.body.categoria as string;
    const status = requisicao.body.status as string;
    const sintoma = requisicao.body.sintoma as string;
    const itensDeServico = requisicao.body.itensDeServico as IItemDeServico[];
    const itensDePeca = requisicao.body.itensDePeca as IItemDePeca[];
    const veiculo = requisicao.body.veiculo as string;
    const oficina = requisicao.body.oficina as string;
    try {
      const informacoesDaOrdemDeServico = {
        dataDeRegistro,
        dataDeInicio,
        dataDeConclusao,
        andamento,
        desconto,
        categoria,
        status,
        sintoma,
        itensDeServico,
        itensDePeca,
        veiculo,
        oficina,
      } as IOrdemDeServico;
      const mensagens = ordemDeServicoServices.validarOrdemDeServico(informacoesDaOrdemDeServico);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      let valorTotal = 0.00;
      let valorTotalDasPecas = 0.00;
      let valorTotalDosServicos = 0.00;
      informacoesDaOrdemDeServico.itensDePeca.forEach((itemDePeca) => {
        valorTotalDasPecas += (itemDePeca.valorUnitario * itemDePeca.quantidade)
      });
      informacoesDaOrdemDeServico.itensDeServico.forEach((itemDeServico) => {
        valorTotalDosServicos += (itemDeServico.valorUnitario * itemDeServico.quantidade)
      });
      valorTotal = valorTotalDasPecas + valorTotalDosServicos;
      informacoesDaOrdemDeServico.valorTotalDasPecas = valorTotalDasPecas;
      informacoesDaOrdemDeServico.valorTotalDosServicos = valorTotalDosServicos;
      informacoesDaOrdemDeServico.valorTotal = valorTotal;

      const result = await OrdemDeServico.updateOne(
        { _id: _id },
        {
          $set: informacoesDaOrdemDeServico
        })
      if (!result.nModified) {
        return resposta.status(500)
          .json({
            mensagem: "Serviço não alterado."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Ordem de serviço alterada com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodas(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string
    try {
      const ordemDeServico = await OrdemDeServico
        .find()
        .populate({
          path: "itensDePeca.peca",
          select: {
            _id: 0,
            __v: 0
          },
          populate: {
            path: "marca",
            select: {
              _id: 0,
              uriLogo: 0,
              __v: 0,
            },
          }
        })
        .populate({
          path: "itensDePeca.fornecedor",
          select: {
            nomeFantasia: 1,
          },
        })
        .populate({
          path: "itensDeServico.funcionario",
          select: {
            nome: 1,
          }
        })
        .populate({
          path: "itensDeServico.servico",
          select: {
            _id: 0,
            __v: 0,
          },
        })
        .populate({
          path: "veiculo",
          select: {
            __v: 0
          }
        })
        .select({
          "itensDeServico._id": 0,
          "itensDePeca._id": 0,
          __v: 0,
        })

      return resposta.json(ordemDeServico);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string
    const _id = requisicao.query._id as string;
    try {
      const ordemDeServico = await OrdemDeServico
        .findOne({
          _id,
          oficina
        })
        .populate({
          path: "itensDePeca.peca",
          populate: {
            path: "marca",
          }
        })
        .populate({
          path: "itensDePeca.fornecedor"
        })
        .populate({
          path: "itensDeServico.funcionario"
        })
        .populate({
          path: "itensDeServico.servico"
        })

      return resposta.json(ordemDeServico);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
  async listarPorVeiculo(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string
    const veiculo = requisicao.query.veiculo as string;
    try {
      if (!validacao.validarId(veiculo)) {
        return resposta.status(406)
          .json({
            mensagem: ['Veículo inválido']
          });
      }
      const ordensDeServico = await ordemDeServicoServices.listarPorVeiculo(oficina, veiculo);
      return resposta.json({ ordensDeServico });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}
