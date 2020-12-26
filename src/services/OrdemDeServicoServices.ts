import OrdemDeServico from "../models/OrdemDeServico"

export default class OrdemDeServicoServices {
  async listarPorVeiculo(oficina: String, veiculo: String) {
    return OrdemDeServico.find({
      veiculo,
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
      });
  }
}