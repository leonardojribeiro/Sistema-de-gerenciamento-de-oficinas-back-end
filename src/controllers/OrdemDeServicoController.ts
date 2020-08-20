import { Request, Response } from "express";
import { IItemDeServico } from "../models/ItemDeServico";
import { IItemDePeca } from "../models/ItemDePeca";
import OrdemDeServico, { IOrdemDeServico } from "../models/OrdemDeServico";
import Marca from "../models/Marca";


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
        .aggregate()
        .unwind("itensDePeca")
        .lookup({
          from: "pecas",
          localField: "itensDePeca.idPeca",
          foreignField: "_id",
          as: "peca",
        })
        .unwind("peca")
        .lookup({
          from: "fornecedors",
          localField: "itensDePeca.idFornecedor",
          foreignField: "_id",
          as: "fornecedor",
        })
        .unwind("fornecedor")
        .lookup({
          from: "veiculos",
          localField: "idVeiculo",
          foreignField: "_id",
          as: "veiculo",
        })
        .unwind("veiculo")
        .project({
          "veiculo._id": "$veiculo._id",
          "veiculo.placa": "$veiculo.placa",
          // "itensDePeca.garantia": "$itensDePeca.garantia",
          //"itensDePeca.unidadeDeGarantia": "$itensDePeca.unidadeDeGarantia",
          "itensDePeca.valorUnitario": "$itensDePeca.valorUnitario",
          "itensDePeca.quantidade": "$itensDePeca.quantidade",
          "itensDePeca.valorTotal": "$itensDePeca.valorTotal",
          "itensDePeca.peca._id": "$peca._id",
          "itensDePeca.peca.descricao": "$peca.descricao",
          //  "itensDePeca.peca.marca._id": "$marca._id",
          // "itensDePeca.peca.marca.descricao": "$marca.descricao",
          // "itensDePeca.peca.marca.uriLogo": "$marca.uriLogo",
          "itensDePeca.fornecedor._id": "$fornecedor._id",
          "itensDePeca.fornecedor.nomeFantasia": "$fornecedor.nomeFantasia",
          "dataDeRegistro": "$dataDeRegistro",
          "dataDeInicio": "$dataDeInicio",
          "dataDeConclusao": "$dataDeConclusao",
          "valorTotalDasPecas": "$valorTotalDasPecas",
          "valorTotalDosServicos": "$valorTotalDosServicos",
          "desconto": "$desconto",
          "valorTotal": "$valorTotal",
          "categoria": "$categoria",
          "status": "$status",
          "sintoma": "$sintoma",
          "itensDeServico": "$itensDeServico"
        })
        .group({
          _id: "$_id",
          itensDePeca: { $push: "$itensDePeca" },
          dataDeRegistro: { $first: "$dataDeRegistro" },
          dataDeInicio: { $first: "$dataDeInicio" },
          dataDeConclusao: { $first: "$dataDeConclusao" },
          valorTotalDasPecas: { $first: "$valorTotalDasPecas" },
          valorTotalDosServicos: { $first: "$valorTotalDosServicos" },
          desconto: { $first: "$desconto" },
          valorTotal: { $first: "$valorTotal" },
          categoria: { $first: "$categoria" },
          status: { $first: "$status" },
          sintoma: { $first: "$sintoma" },
          veiculo: {$first: "$veiculo"},
          itensDeServico: { $first: "$itensDeServico" },
        })
        .unwind("itensDeServico")
        .lookup({
          from: "servicos",
          localField: "itensDeServico.idServico",
          foreignField: "_id",
          as: "servico",
        })
        .unwind("servico")
        .lookup({
          from: "funcionarios",
          localField: "itensDeServico.idFuncionario",
          foreignField: "_id",
          as: "funcionario",
        })
        .unwind("funcionario")
        .project({
          "veiculo": "$veiculo",
          "itensDePeca": "$itensDePeca",
          "itensDeServico.valorUnitario": "$itensDeServico.valorUnitario",
          "itensDeServico.quantidade": "$itensDeServico.quantidade",
          "itensDeServico.valorTotal": "$itensDeServico.valorTotal",
          "itensDeServico.servico._id": "$servico._id",
          "itensDeServico.servico.descricao": "$servico.descricao",
          "itensDeServico.funcionario._id": "$funcionario._id",
          "itensDeServico.funcionario.nome": "$funcionario.nome",
          "dataDeRegistro": "$dataDeRegistro",
          "dataDeInicio": "$dataDeInicio",
          "dataDeConclusao": "$dataDeConclusao",
          "valorTotalDasPecas": "$valorTotalDasPecas",
          "valorTotalDosServicos": "$valorTotalDosServicos",
          "desconto": "$desconto",
          "valorTotal": "$valorTotal",
          "categoria": "$categoria",
          "status": "$status",
          "sintoma": "$sintoma",
        })
        .group({
          _id: "$_id",
          veiculo: {$first: "$veiculo"},
          itensDePeca: { $first: "$itensDePeca" },
          itensDeServico: { $push: "$itensDeServico" },
          dataDeRegistro: { $first: "$dataDeRegistro" },
          dataDeInicio: { $first: "$dataDeInicio" },
          dataDeConclusao: { $first: "$dataDeConclusao" },
          valorTotalDasPecas: { $first: "$valorTotalDasPecas" },
          valorTotalDosServicos: { $first: "$valorTotalDosServicos" },
          desconto: { $first: "$desconto" },
          valorTotal: { $first: "$valorTotal" },
          categoria: { $first: "$categoria" },
          status: { $first: "$status" },
          sintoma: { $first: "$sintoma" },
        })

      return resposta.json(ordemDeServico);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
}
