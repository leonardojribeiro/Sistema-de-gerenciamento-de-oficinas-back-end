import VeiculoServices from '../services/VeiculoServices';
import VinculoServices from '../services/VinculoServices';
import servicoValidacao from '../services/servicoValidacao';
import { Response, Request } from 'express';
import { IVeiculo } from '../models/Veiculo';
import { ICliente } from '../models/Cliente';
import { IVinculo } from '../models/Vinculo';
import getDataAtual from '../util/DataUtil';
const veiculoServices = new VeiculoServices();
const vinculoServices = new VinculoServices();

interface InformacoesDoVeiculo extends IVeiculo {
  cliente: ICliente['_id'];
}

export default class VeiculoController {

  async incluirVeiculo(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const placa = requisicao.body.placa as string;
    const anoFabricacao = requisicao.body.anoFabricacao as Date;
    const anoModelo = requisicao.body.anoModelo as Date;
    const modelo = requisicao.body.modelo as string;
    const cliente = requisicao.body.cliente as string;
    try {
      const veiculoASerInserido = {
        placa,
        anoFabricacao,
        anoModelo,
        modelo,
        cliente,
        oficina,
      } as InformacoesDoVeiculo
      const mensagens = veiculoServices.validarVeliculoASerIncluido(veiculoASerInserido);
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
      const veiculoInserido = await veiculoServices.incluirVeiculo(veiculoASerInserido);
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
        cliente,
        veiculo: veiculoInserido._id,
        oficina,
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
    const oficina = requisicao.body.oficina as string;
    try {
      const veiculos = await veiculoServices.listarPorIdOficina(oficina);
      return resposta.json({
        itens: veiculos
      });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoVeiculo = {
        _id,
        oficina,
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
      if (!veiculoListado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar veículo."
          });
      }
      return resposta.json({
        cliente: veiculoListado.cliente,
        ...veiculoListado.veiculo._doc
      });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }


  async alterarVeiculo(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.body._id as string;
    const placa = requisicao.body.placa as string;
    const anoFabricacao = requisicao.body.anoFabricacao as Date;
    const anoModelo = requisicao.body.anoModelo as Date;
    const modelo = requisicao.body.modelo as string;
    const cliente = requisicao.body.cliente as string;
    try {
      const veiculoASerAlterado = {
        _id,
        placa,
        anoFabricacao,
        anoModelo,
        modelo,
        cliente,
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
        cliente,
        veiculo: _id,
        oficina,
      } as IVinculo;
      //conta os vinculos que tem o mesmo ids e que não estão com vínculo final
      const vinculoExistente = await vinculoServices.contarPorIdClienteIdVeiculoEIdOficina(informacoesDoVinculo);
      console.log(vinculoExistente)
      if (!vinculoExistente) {//se existe um vínculo, nada é alterado nos vínculos, mas se não existir, ele é criado
        //lista o último vínculo, que está sem data final
        console.log('entrou aqui')
        const vinculoAnterior = await vinculoServices.listarPorIdVeiculoEIdOficina(informacoesDoVinculo);
        console.log(vinculoAnterior);

        if (vinculoAnterior) {
          vinculoAnterior.oficina = oficina;
          vinculoAnterior.vinculoFinal = getDataAtual();//adiciona a data atual como vinculo final
          console.log(await vinculoServices.alterarVinculo(vinculoAnterior));//salva o vínculo anterior
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

  async consultarVinculos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const cliente = requisicao.query.cliente as string;
    const veiculo = requisicao.query.veiculo as string
    try {
      // const mensagens = servicoValidacao.validarIdDoCliente(cliente);
      // mensagens.push(...servicoValidacao.validarIdDoVeiculo(veiculo));
      // if (mensagens.length) {
      //   return resposta
      //     .status(406)
      //     .json({
      //       mensagem: mensagens
      //     });
      // }
      const vinculos = await veiculoServices.consultarVinculos(oficina, cliente, veiculo);
      return resposta.json({ vinculos });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

}
