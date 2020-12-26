import OrdemDeServico from "../models/OrdemDeServico"

export default class OrdemDeServicoServices {
  async listarPorVeiculo(oficina: String, veiculo: String) {
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