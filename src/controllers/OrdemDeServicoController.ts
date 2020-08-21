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
    const idVeiculo = requisicao.body.idVeiculo as string;
    const idOficina = requisicao.body.idOficina as string;
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
        idVeiculo,
        idOficina,
      } as IOrdemDeServico;
      console.log(informacoesDaOrdemDeServico);
      await OrdemDeServico.create(informacoesDaOrdemDeServico);
      return resposta.status(201).json({ mensagem: "Ordem de serviço cadastrada com sucesso!" })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
  async listarTodas(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string
    try {
      const ordemDeServico = await OrdemDeServico
        .find()
        .populate({
          path: "itensDePeca.idPeca"
        })



        //.aggregate()
      //   .lookup({
      //     from: "fornecedors",
      //     localField: "itensDePeca.idFornecedor",
      //     foreignField: "_id",
      //     as: "fornecedores",
      //   })
      //   .lookup({
      //     from: "pecas",
      //     localField: "itensDePeca.idPeca",
      //     foreignField: "_id",
      //     as: "pecas",
      //   })
      //   .lookup({
      //     from: "funcionarios",
      //     localField: "itensDeServico.idFuncionario",
      //     foreignField: "_id",
      //     as: "funcionarios",
      //   })
      //   .lookup({
      //     from: "servicos",
      //     localField: "itensDeServico.idServico",
      //     foreignField: "_id",
      //     as: "servicos",
      //   })
      //   .lookup({
      //     from: "veiculos",
      //     localField: "idVeiculo",
      //     foreignField: "_id",
      //     as: "veiculo",
      //   })
      //   .unwind('veiculo')
      //   .group({
      //     _id: "$_id",
      //     itensDePeca: {$first: "$itensDePeca"},
      //     fornecedores: { $first: "$fornecedores" },
      //     pecas: { $first: "$pecas" },
      //     itensDeServico: {$first: "$itensDeServico"},
      //     funcionarios: { $first: "$funcionarios" },
      //     servicos: { $first: "$servicos" },
      //     veiculo: { $first: "$veiculo" },
      //     dataDeRegistro: { $first: "$dataDeRegistro" },
      //     dataDeInicio: { $first: "$dataDeInicio" },
      //     dataDeConclusao: { $first: "$dataDeConclusao" },
      //     valorTotalDasPecas: { $first: "$valorTotalDasPecas" },
      //     valorTotalDosServicos: { $first: "$valorTotalDosServicos" },
      //     desconto: { $first: "$desconto" },
      //     valorTotal: { $first: "$valorTotal" },
      //     categoria: { $first: "$categoria" },
      //     status: { $first: "$status" },
      //     sintoma: { $first: "$sintoma" },
      //   })
      // .project({
      //   _id: 1,
      //   "fornecedores.endereco":0,
      //   "funcionarios.endereco":0,
      //   "veiculo.idOficina":0,
      // })
     

      return resposta.json(ordemDeServico);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}
