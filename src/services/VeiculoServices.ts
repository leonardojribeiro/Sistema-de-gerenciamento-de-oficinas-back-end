import validacao from "../util/validacao";
import Veiculo, { IVeiculo } from "../models/Veiculo";
import servicoValidacao from "./servicoValidacao";
import { Types } from "mongoose";
import { ICliente } from "../models/Cliente";
import Vinculo from "../models/Vinculo";

interface IIVeiculo extends IVeiculo {
  cliente: ICliente['_id'];
}

export default class VeiculoServices {
  validarVeliculoASerIncluido(informacoesDoVeiculo: IIVeiculo) {
    const mensagens: string[] = []
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarData(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarData(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.modelo));
    mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.cliente));
    return mensagens;
  }

  validarVeliculoASerAlterado(informacoesDoVeiculo: IIVeiculo) {
    const mensagens: string[] = [];
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
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "veiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        oficina: Types.ObjectId(oficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.cliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "modelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.marca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("modelo")
      .unwind("marca")
      .unwind("cliente")
      .replaceRoot({
        $mergeObjects: [
          "$$ROOT",
          {
            "modelo": {
              $mergeObjects: [
                "$modelo",
                { "marca": "$marca" }
              ]
            }
          }
        ]
      })
      .project({
        oficina: 0,
        marca: 0,
        vinculo: 0,
        __v: 0,
        "cliente.oficina": 0
      })

  }

  async listarPorIdVeiculoEIdOficina(informacoesDoVeiculo: IVeiculo) {
    return await Veiculo
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "veiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        _id: Types.ObjectId(informacoesDoVeiculo._id),
        oficina: Types.ObjectId(informacoesDoVeiculo.oficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.cliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "modelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.marca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("cliente")
      .unwind("modelo")
      .unwind("marca")
      .group({
        _id: "$_id",
        cliente: {
          $first: "$cliente._id"
        },
        modelo: {
          $first: "$modelo._id"
        },
        placa: {
          $first: "$placa"
        },
        anoFabricacao: {
          $first: "$anoFabricacao"
        },
        anoModelo: {
          $first: "$anoModelo"
        }
      });
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

  async consultarVeiculo(oficina: String, cliente: String) {
    return await Vinculo
      .find({
        oficina,
        cliente,
      })
      .populate({
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
      })
      .select({
        __v: 0,
        _id: 0,
        cliente: 0,
      })
  }
}