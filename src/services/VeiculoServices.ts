import validacao from "../util/validacao";
import Veiculo, { IVeiculo } from "../models/Veiculo";
import servicoValidacao from "./servicoValidacao";
import  { Types } from "mongoose";

export default class VeiculoServices {
  validarVeliculoASerInserido(informacoesDoVeiculo: IVeiculo) {
    const mensagens: string[] = []
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarData(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarData(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.idModelo));
    //mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.idCliente));
    return mensagens;
  }

  validarVeliculoASerAlterado(informacoesDoVeiculo: IVeiculo) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoVeiculo.placa) && mensagens.push("Placa é obrigatória.")
      || !validacao.validarPlaca(informacoesDoVeiculo.placa) && mensagens.push("Placa inválida.");
    !validacao.validarData(informacoesDoVeiculo.anoFabricacao) && mensagens.push("Ano de fabricacao é obrigatório.");
    !validacao.validarData(informacoesDoVeiculo.anoModelo) && mensagens.push("Ano de modelo é obrigatório.");
    mensagens.push(...servicoValidacao.validarIdDoModelo(informacoesDoVeiculo.idModelo));
    //mensagens.push(...servicoValidacao.validarIdDoCliente(informacoesDoVeiculo.idCliente));
    mensagens.push(...servicoValidacao.validarIdDoVeiculo(informacoesDoVeiculo._id));
    return mensagens;
  }

  async inserirVeiculo(informacoesDoVeiculo: IVeiculo) {
    return await Veiculo
      .create(informacoesDoVeiculo);
  }

  async contarPorPlacaEIdOficina(veiculo: IVeiculo) {
    return await Veiculo
      .countDocuments({
        placa: veiculo.placa,
        idOficina: veiculo.idOficina,
      });
  }

  async listarPorIdOficina(idOficina: string) {
    return await Veiculo
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "idVeiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        idOficina: Types.ObjectId(idOficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.idCliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "idModelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.idMarca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("modelo")
      .unwind("marca")
      .project({
        idModelo: 0,
        idOficina: 0,
        __v: 0,
        vinculo: 0,
        "cliente.__v": 0,
        "cliente.endereco": 0,
        "cliente.idOficina": 0,
        "modelo.idMarca": 0,
        "modelo.idOficina": 0,
        "modelo.__v": 0,
        "marca.idOficina": 0,
        "marca.__v": 0,
      });
  }

  async listarPorIdVeiculoEIdOficina(informacoesDoVeiculo: IVeiculo) {
    return await Veiculo
      .aggregate()
      .lookup({
        from: 'vinculos',
        localField: "_id",
        foreignField: "idVeiculo",
        as: "vinculo",
      })
      .unwind("vinculo")
      .match({
        _id: Types.ObjectId(informacoesDoVeiculo._id),
        idOficina: Types.ObjectId(informacoesDoVeiculo.idOficina),
        "vinculo.vinculoFinal": { $exists: false }
      })
      .lookup({
        from: "clientes",
        localField: "vinculo.idCliente",
        foreignField: "_id",
        as: "cliente"
      })
      .lookup({
        from: "modelos",
        localField: "idModelo",
        foreignField: "_id",
        as: "modelo"
      })
      .lookup({
        from: "marcas",
        localField: "modelo.idMarca",
        foreignField: "_id",
        as: "marca"
      })
      .unwind("cliente")
      .unwind("modelo")
      .unwind("marca")
      .group({
        _id: "$_id",
        idCliente: {
          $first: "$cliente._id"
        },
        idModelo: {
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
}