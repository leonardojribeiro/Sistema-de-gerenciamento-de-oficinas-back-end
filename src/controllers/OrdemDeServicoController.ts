import { Request, Response } from "express";
import { IItemDeServico } from "../models/ItemDeServico";
import ItemDePeca, { IItemDePeca } from "../models/ItemDePeca";
import OrdemDeServico, { IOrdemDeServico } from "../models/OrdemDeServico";
import Marca from "../models/Marca";
import { Aggregate } from "mongoose";


export default class OrdemDeServicoContoller {
  async incluirOrdemDeServico(requisicao: Request, resposta: Response) {
    const dataDeRegistro = requisicao.body.dataDeRegistro as Date;
    const dataDeInicio = requisicao.body.dataDeInicio as Date;
    const dataDeConclusao = requisicao.body.dataDeConclusao as Date;
    const andamento = requisicao.body.andamento as number;
    const valorTotalDosServicos = requisicao.body.valorTotalDosServicos as number;
    const valorTotalDasPecas = requisicao.body.valorTotalDasPecas as number;
    const desconto = requisicao.body.desconto as number;
    const valorTotal = requisicao.body.valorTotal as number;
    const categoria = requisicao.body.categoria as string;
    const status = requisicao.body.status as string;
    const sintoma = requisicao.body.sintoma as string;
    const itensDeServico = requisicao.body.itensDeServico as IItemDeServico[];
    const itensDePeca = requisicao.body.itensDePeca as IItemDePeca[];
    const veiculo = requisicao.body.veiculo as string;
    const oficina = requisicao.body.oficina as string;
    console.log(requisicao.body)
    try {
      const informacoesDaOrdemDeServico = {
        dataDeRegistro,
        dataDeInicio,
        dataDeConclusao,
        andamento,
        valorTotalDosServicos,
        valorTotalDasPecas,
        desconto,
        categoria,
        status,
        sintoma,
        valorTotal,
        itensDeServico,
        itensDePeca,
        veiculo,
        oficina,
      } as IOrdemDeServico;
      await OrdemDeServico.create(informacoesDaOrdemDeServico);
      return resposta.status(201).json({ mensagem: "Ordem de serviço cadastrada com sucesso!" })
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
          populate:{
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
        .populate({
          path: "veiculo"
        })
        
      return resposta.json(ordemDeServico);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}
