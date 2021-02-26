import { FilterQuery } from "mongoose";
import { IItemDePeca } from "../models/ItemDePeca";
import { IItemDeServico } from "../models/ItemDeServico";
import OrdemDeServico, { IOrdemDeServico } from "../models/OrdemDeServico"
import validacao from "../util/validacao";
import servicoValidacao from "./servicoValidacao";

interface QueryOrdemDeServico {
  veiculo?: string;
  dataDeInicio?: Date;
  dataDeConclusao?: Date;
  dataDeRegistro?: Date;
  status?: string;
}

export default {

  validarItemDeServico(itemDeServico: IItemDeServico) {
    const mensagens: string[] = [];
    mensagens.push(...servicoValidacao.validarIdDoServico(itemDeServico.servico));
    mensagens.push(...servicoValidacao.validarIdDoFuncionario(itemDeServico.funcionario));
    !validacao.validarNumero(itemDeServico.garantia) && mensagens.push("Garantia é obrigatória");
    //validar tipo de garantia
    !validacao.validarNumero(itemDeServico.valorUnitario) && mensagens.push("Valor unitário é obrigatório");
    !validacao.validarNumero(itemDeServico.quantidade) && mensagens.push("Quantidade é obrigatória");
    !validacao.validarNumero(itemDeServico.valorTotal) && mensagens.push("Valor total é obrigatório");
    return mensagens
  },
  validarItemDePEca(itemDePeca: IItemDePeca) {
    const mensagens: string[] = [];
    mensagens.push(...servicoValidacao.validarIdDaPeca(itemDePeca.peca));
    mensagens.push(...servicoValidacao.validarIdDoFornecedor(itemDePeca.fornecedor));
    !validacao.validarNumero(itemDePeca.garantia) && mensagens.push("Garantia é obrigatória");
    //validar tipo de garantia
    !validacao.validarNumero(itemDePeca.valorUnitario) && mensagens.push("Valor unitário é obrigatório");
    !validacao.validarNumero(itemDePeca.quantidade) && mensagens.push("Quantidade é obrigatória");
    !validacao.validarNumero(itemDePeca.valorTotal) && mensagens.push("Valor total é obrigatório");
    return mensagens
  },

  validarOrdemDeServico(ordemDeServico: IOrdemDeServico) {
    const mensagens: string[] = [];
    mensagens.push(...servicoValidacao.validarIdDoVeiculo(ordemDeServico.veiculo));
    !validacao.validarTexto(ordemDeServico.sintoma) && mensagens.push("Sintoma é obrigatório");
    !validacao.validarNumero(ordemDeServico.andamento) && mensagens.push("Andamento é obrigatório");
    ordemDeServico.itensDeServico.length < 1 && mensagens.push("Pelo menos um serviço é necessário");
    ordemDeServico.itensDeServico.forEach(itemDeServico =>
      mensagens.push(...this.validarItemDeServico(itemDeServico))
    );
    ordemDeServico.itensDePeca.forEach(itemDePeca =>
      mensagens.push(...this.validarItemDePEca(itemDePeca))
    );
    return mensagens;
  },

  validarOrdemDeServicoASerAlterada(ordemDeServico: IOrdemDeServico) {
    const mensagens: string[] = [];
    mensagens.push(...servicoValidacao.validarIdDaOrdemDeServico(ordemDeServico._id));
    !validacao.validarTexto(ordemDeServico.sintoma) && mensagens.push("Sintoma é obrigatório");
    !validacao.validarNumero(ordemDeServico.andamento) && mensagens.push("Andamento é obrigatório");
    ordemDeServico.itensDeServico.length < 1 && mensagens.push("Pelo menos um serviço é necessário");
    ordemDeServico.itensDeServico.forEach(itemDeServico =>
      mensagens.push(...this.validarItemDeServico(itemDeServico))
    );
    ordemDeServico.itensDePeca.forEach(itemDePeca =>
      mensagens.push(...this.validarItemDePEca(itemDePeca))
    );
    return mensagens;
  },

  async incluirOrdemDeServico(informacoesDaOrdemDeServico: IOrdemDeServico) {
    return await OrdemDeServico.create(informacoesDaOrdemDeServico);
  },

  async listarPorOficina(oficina: string, skip: number, limit: number) {
    return await OrdemDeServico
      .find({
        oficina,
      })
      .skip(skip)
      .limit(limit)
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
  },

  async contarEmAndamentoPorOficina(oficina: string) {
    return await OrdemDeServico
      .countDocuments({
        oficina,
        status: '0'
      })
  },

  async contarPorOficina(oficina: string) {
    return await OrdemDeServico
      .countDocuments({
        oficina
      })
  },

  async consultar(oficina: string, { veiculo, dataDeConclusao, dataDeInicio, dataDeRegistro,status }: QueryOrdemDeServico, skip: number, limit: number) {
    let match: FilterQuery<IOrdemDeServico> = { oficina }
    if (veiculo) {
      match = { ...match, veiculo };
    }
    if (dataDeRegistro) {
      match = {
        ...match,
        dataDeRegistro: {
          $gte: dataDeRegistro
        }
      }
    }
    if(status){
      match = {
        ...match,
        status,
      }
    }
    return await OrdemDeServico
      .find(match)
      .skip(skip)
      .limit(limit)
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
  },

  async contarPorConsulta(oficina: string, veiculo: string = "") {
    let match: any = { oficina }
    if (veiculo) {
      match = { ...match, veiculo };
    }
    return await OrdemDeServico
      .countDocuments(match)
  },

  async listarPorVeiculo(oficina: string, veiculo: string) {
    return OrdemDeServico.find({
      veiculo,
      oficina
    })
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
  },
}