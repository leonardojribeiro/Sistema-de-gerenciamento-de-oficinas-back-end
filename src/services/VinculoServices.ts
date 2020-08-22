import validacao from "../util/validacao";
import Vinculo, { IVinculo } from "../models/Vinculo";

export default class VinculoServices {

  validar(vinculo: IVinculo) {
    const mensagens : string[] = []
    !validacao.validarTexto(vinculo.cliente) && mensagens.push("Id do cliente é obrigatório.");
    !validacao.validarTexto(vinculo.veiculo) && mensagens.push("Id do veículo é obrigatório.");
    !validacao.validarTexto(vinculo.oficina) && mensagens.push("Id da oficina é obrigatório.");
    return mensagens
  }

  async inserir(vinculo: IVinculo) {
    return await Vinculo
      .create(vinculo);
  }

  async contarPorIdClienteIdVeiculoEIdOficina(vinculo: IVinculo) {
    return await Vinculo
      .countDocuments({
        cliente: vinculo.cliente,
        veiculo: vinculo.veiculo,
        oficina: vinculo.oficina,
        vinculoFinal: undefined
      });
  }

  async listarPorIdVeiculoEIdOficina(vinculo: IVinculo) {
    return await Vinculo
      .findOne({
        veiculo: vinculo.veiculo,
        oficina: vinculo.oficina,
        vinculoFinal: undefined
      });
  }

  async alterarVinculo(vinculo: IVinculo) {
    return await Vinculo
      .replaceOne(
        {
          _id: vinculo.id
        },
        vinculo
      );
  }

}