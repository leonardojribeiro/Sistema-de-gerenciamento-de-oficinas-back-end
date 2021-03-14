import path from 'path';
import marcaServices from '../services/MarcaServices';
import servicoValidacao from '../services/servicoValidacao';
import { Request, Response } from 'express';
import { IMarca } from '../models/Marca';
import { sendMessageTo } from '../Socket';
import fs from "fs";
import { promisify } from 'util'

export default {
  async incluirMarca(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.body.descricao as string;
    try {
      const marcaASerInserida = {
        descricao,
        oficina,
      } as IMarca;
      const mensagens = marcaServices.validarMarcaASerIncluida(marcaASerInserida);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const marcaExistenteNaOficina = await marcaServices.contarPorDescricaoEIdOficina(marcaASerInserida);
      if (marcaExistenteNaOficina) {
        return resposta
          .status(406)
          .json({
            mensagem: "Essa marca já está cadastrada"
          });
      }
      let uriLogo = '';
      if (requisicao.file) {
        if (process.env.STORAGE_TYPE === "googleStorage") {
          uriLogo = await marcaServices.fazerUploadDaLogomarca(requisicao.file)
          if (!uriLogo.length) {
            return resposta
              .status(500)
              .json({
                mensagem: "Marca não cadastrada."
              });
          }
        }
        else {
          console.log(requisicao.file.filename)
          uriLogo = requisicao.file.filename;
        }
      }
      marcaASerInserida.uriLogo = uriLogo;
      const marcaInserida = await marcaServices.incluirMarca(marcaASerInserida);
      if (!marcaInserida) {
        return resposta
          .status(500)
          .json({
            mensagem: "Marca não cadastrada."
          });
      }
      sendMessageTo(oficina, 'marcaIncluido', marcaInserida);
      return resposta
        .status(201)
        .json({
          mensagem: "Marca cadastrada com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },

  async listarTodos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pular = Number(requisicao.query.pular)
    const limite = Number(requisicao.query.limite);
    try {
      const marcas = await marcaServices.listarPorOficina(oficina, pular, limite);
      const total = await marcaServices.contarPorOficina(oficina);
      return resposta.json({
        itens: marcas,
        total
      });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },

  async listarMarcaPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const mensagens = servicoValidacao.validarIdDaMarca(_id);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const marcaListada = await marcaServices.listarPorIdMarcaEIdOficina(oficina, _id);
      if (!marcaListada) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar marca."
          });
      }
      return resposta.json(marcaListada);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },

  async consultarMarcas(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const descricao = requisicao.query.descricao as string;
    const pular = Number(requisicao.query.pular)
    const limite = Number(requisicao.query.limite);
    try {
      const marcas = await marcaServices.consultar(oficina, descricao, pular, limite);
      const total = await marcaServices.contarPorConsulta(oficina, descricao,);
      return resposta
        .json({
          itens: marcas,
          total,
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },

  async alterarMarca(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const descricao = requisicao.body.descricao as string;
    const uriLogo = requisicao.body.uriLogo as string;
    try {
      const marcaASerAleterada = {
        _id,
        descricao,
      } as IMarca;
      const mensagens = marcaServices.validarMarcaASerAlterada(marcaASerAleterada);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      let uriLogoNova = '';
      if (requisicao.file) {
        if (process.env.STORAGE_TYPE === "googleStorage") {
          uriLogoNova = await marcaServices.fazerUploadDaLogomarca(requisicao.file)
          if (!uriLogoNova.length) {
            return resposta
              .status(500)
              .json({
                mensagem: "Marca não alterada."
              });
          }
        }
        else {
          uriLogoNova = requisicao.file.filename;
        }
      }
      marcaASerAleterada.uriLogo = uriLogoNova;
      const resultado = await marcaServices.alterarMarca(marcaASerAleterada);
      if (!resultado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Marca não editada."
          });
      }
      if (process.env.STORAGE_TYPE === "googleStorage") {
        await marcaServices.apagarLogomarca(uriLogo);
      }
      else {
        promisify(fs.unlink)(
          path.resolve(__dirname, "..", "..", "images", "uploads", uriLogo)
        )
      }
      return resposta
        .status(201)
        .json({
          mensagem: "Marca alterada com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },
}
