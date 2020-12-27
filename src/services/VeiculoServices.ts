import validacao from "../util/validacao";
import Veiculo, { IVeiculo } from "../models/Veiculo";
import servicoValidacao from "./servicoValidacao";
import { ICliente } from "../models/Cliente";
import Vinculo from "../models/Vinculo";

interface IIVeiculo extends IVeiculo {
  cliente: ICliente['_id'];
}

export default class VeiculoServices {
  validarVeliculoASerIncluido(informacoesDoVeiculo: IIVeiculo) {
    const mensagens: String[] = []
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarData(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarData(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.modelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.cliente));
    return mensagens;
  }

  validarVeliculoASerAlterado(informacoesDoVeiculo: IIVeiculo) {
    const mensagens: String[] = [];
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarData(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarData(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.modelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.cliente));
    mensagens.push(...servicoValidacao.validarIdDoVeiculo(informacoesDoVeiculo._id));
    return mensagens;
  }

  async incluirVeiculo(informacoesDoVeiculo: IVeiculo) {
    return await Veiculo
      .create(informacoesDoVeiculo);
  }

  async contarPorPlacaEIdOficina(veiculo: IVeiculo) {
    return await Veiculo
      .countDocuments({
        placa: veiculo.placa,
        oficina: veiculo.oficina,
      });
  }

  async listarPorIdOficina(oficina: string) {
    return await Veiculo
      .find({
        oficina,
      })
      .populate({
        path: "modelo",
        select: {
          _id: 0,
          __v: 0
        },
        populate: {
          path: "marca",
          select: {
            _id: 0,
            __v: 0
          },
        }
      })
      .select({
        __v: 0,
      })

  }

  async listarPorIdVeiculoEIdOficina(informacoesDoVeiculo: IVeiculo) {
    return await Vinculo
      .findOne({
        oficina: informacoesDoVeiculo.oficina,
        veiculo: informacoesDoVeiculo._id,
      })
      .populate({
        path: "veiculo",
        select: {
          __v: 0,
        }
      })
      .select({
        _id: 0,
        vinculoInicial: 0,
        vinculoFinal: 0,
        __v: 0,
      })
  }

  async alterarVeiculo(informacoesDoVeiculo: IVeiculo) {
    return await Veiculo
      .updateOne(
        {
          _id: informacoesDoVeiculo._id
        },
        {
          $set: informacoesDoVeiculo
        }
      );
  }

  async consultarVinculos(oficina: String, cliente: String, veiculo: String) {
    return await Vinculo
      .find({
        oficina,
        ...(cliente !== undefined ? { cliente } : { veiculo }),
      })
      .populate(
        cliente !== undefined ? {
          path: "veiculo",
          select: {
            __v: 0
          },
          populate: {
            path: "modelo",
            select: {
              _id: 0,
              __v: 0
            },
            populate: {
              path: "marca",
              select: {
                _id: 0,
                __v: 0
              },
            }
          }
        } : {
            path: "cliente"
          })
      .select({
      })
  }
}