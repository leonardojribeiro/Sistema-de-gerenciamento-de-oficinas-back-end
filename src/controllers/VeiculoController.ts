import VeiculoServices from '../services/VeiculoServices';
import VinculoServices from '../services/VinculoServices';
import servicoValidacao from '../services/servicoValidacao';
import { Response, Request } from 'express';
import { IVeiculo } from '../models/Veiculo';
import { ICliente } from '../models/Cliente';
import { IVinculo } from '../models/Vinculo';
import DataUtil from '../util/DataUtil';
import getDataAtual from '../util/DataUtil';
const veiculoServices = new VeiculoServices();
const vinculoServices = new VinculoServices();

interface InformacoesDoVeiculo extends IVeiculo {
  idCliente: ICliente['_id'];
}

export default class VeiculoController{

  async inserirVeiculo(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const placa = requisicao.body.placa as string;
    const anoFabricacao = requisicao.body.anoFabricacao as Date;
    const anoModelo = requisicao.body.anoModelo as Date;
    const idModelo = requisicao.body.idModelo as string;
    const idCliente = requisicao.body.idCliente as string;
    try {
      const veiculoASerInserido = {
        placa,
        anoFabricacao,
        anoModelo,
        idModelo,
        idCliente,
        idOficina,
      } as InformacoesDoVeiculo
      const mensagens = veiculoServices.validarVeliculoASerInserido(veiculoASerInserido);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const veiculoExistenteNaOficina = await veiculoServices.contarPorPlacaEIdOficina(veiculoASerInserido);
      if (veiculoExistenteNaOficina) {
        return resposta
          .status(406)
          .json({
            mensagem: "Esse veículo já está cadastrado."
          });
      }
      const veiculoInserido = await veiculoServices.inserirVeiculo(veiculoASerInserido);
      if (!veiculoInserido) {
        return resposta
          .status(500)
          .json({
            mensagem: "Veículo não cadastrado."
          });
      }
      const vinculoInicial = new Date();
      vinculoInicial.setTime(Date.now());
      const vinculoASerCriado = {
        vinculoInicial,
        idCliente,
        idVeiculo: veiculoInserido._id,
        idOficina,
      } as IVinculo;
      const vinculo = await vinculoServices.inserir(vinculoASerCriado)
      if (!vinculo) {
        return resposta
          .status(500)
          .json({
            mensagem: "Veículo cadastrado, porém não vinculado."
          });
      }
      return resposta
        .status(201)
        .json({
          mensagem: "Veículo cadastrado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    try {
      const veiculos = await veiculoServices.listarPorIdOficina(idOficina);
      return resposta.json(veiculos);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoVeiculo = {
        _id,
        idOficina,
      } as InformacoesDoVeiculo;
      const mensagens = servicoValidacao.validarIdDoVeiculo(_id);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const veiculoListado = await veiculoServices.listarPorIdVeiculoEIdOficina(informacoesDoVeiculo);
      if (!veiculoListado || !veiculoListado.length) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar especialidade."
          });
      }
      return resposta.json(veiculoListado[0])
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
  
  async alterarVeiculo(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.body._id as string;
    const placa = requisicao.body.placa as string;
    const anoFabricacao = requisicao.body.anoFabricacao as Date;
    const anoModelo = requisicao.body.anoModelo as Date;
    const idModelo = requisicao.body.idModelo as string;
    const idCliente = requisicao.body.idCliente as string;
    try {
      const veiculoASerAlterado = {
        _id,
        placa,
        anoFabricacao,
        anoModelo,
        idModelo,
        idCliente,
      } as InformacoesDoVeiculo;
      const mensagens = veiculoServices.validarVeliculoASerAlterado(veiculoASerAlterado);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }

      const informacoesDoVinculo = {
        idCliente,
        idVeiculo: _id,
        idOficina,
      } as IVinculo;
      //conta os vinculos que tem o mesmo ids e que não estão com vínculo final
      const vinculoExistente = await vinculoServices.contarPorIdClienteIdVeiculoEIdOficina(informacoesDoVinculo);
      console.log(vinculoExistente)
      if (!vinculoExistente) {//se existe um vínculo, nada é alterado nos vínculos, mas se não existir, ele é criado
        //lista o último vínculo, que está sem data final
        const vinculoAnterior = await vinculoServices.listarPorIdVeiculoEIdOficina(informacoesDoVinculo);
        console.log(vinculoAnterior);

        if (vinculoAnterior) {
          vinculoAnterior.vinculoFinal = getDataAtual();//adiciona a data atual como vinculo final
          await vinculoServices.alterarVinculo(vinculoAnterior);//salva o vínculo anterior
        }

        informacoesDoVinculo.vinculoInicial = getDataAtual();

        const vinculo = await vinculoServices.inserir(informacoesDoVinculo)
        if (!vinculo) {
          return resposta
            .status(500)
            .json({
              mensagem: "Veículo alterado, porém não vinculado."
            });
        }
      }
      const resultado = await veiculoServices.alterarVeiculo(veiculoASerAlterado);
      if (!resultado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Veículo não alterado."
          });
      }
      return resposta
        .json({
          mensagem: "Veículo alterado com sucesso."
        })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

}
