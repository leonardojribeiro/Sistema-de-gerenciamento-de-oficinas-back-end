import { IItemDePeca } from "../models/ItemDePeca";
import { IItemDeServico } from "../models/ItemDeServico";
import OrdemDeServico, { IOrdemDeServico } from "../models/OrdemDeServico"
import validacao from "../util/validacao";
import servicoValidacao from "./servicoValidacao";

export default class OrdemDeServicoServices {

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
  }
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
  }

  validarOrdemDeServicoASerInserida(ordemDeServico: IOrdemDeServico) {
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
  }

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
  }
}