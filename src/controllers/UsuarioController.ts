import UsuarioServices from "../services/usuarioServices";
import criptografia from "../util/Criptografia";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { IUsuario } from "../models/Usuario";

const usuarioServices = new UsuarioServices()

export default class UsuarioController {

  async incluirDadosDeUsuario(requisicao: Request, resposta: Response) {
    const nomeUsuario = requisicao.body.nomeUsuario
    const senha = requisicao.body.senha;
    const perfil = requisicao.body.perfil;
    const idOficina = requisicao.body.idOficina;
    try {
      const usuarioASerInserido = {
        nomeUsuario,
        senha,
        perfil,
        idOficina,
      } as IUsuario
      const mensagens = usuarioServices.validarUsuarioASerInserido(usuarioASerInserido);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      const usuarioExistenteNaOficina = await usuarioServices.contarPorOficinaEUsuario(usuarioASerInserido);
      if (usuarioExistenteNaOficina) {
        return resposta
          .status(406)
          .json({
            mensagem: "Este usuário já está cadastrado nessa oficina."
          });
      }
      usuarioASerInserido.senha = criptografia.criptografar(usuarioASerInserido.senha);
      const usuarioInserido = await usuarioServices.inserir(usuarioASerInserido);
      if (!usuarioInserido) {
        return resposta
          .status(500)
          .json({
            mensagem: "Usuário não cadastrado."
          });
      }
      return resposta
        .status(201)
        .json({
          mensagem: "Usuário cadastrado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async efetuarLogin(requisicao: Request, resposta: Response) {
    const nomeUsuario = requisicao.body.nomeUsuario;
    const senha = requisicao.body.senha;
    try {
      const usuarioLogin = {
        nomeUsuario,
        senha,
      } as IUsuario;
      const mensagens = usuarioServices.validarUsuarioLogin(usuarioLogin);
      if (mensagens.length) {
        return resposta
          .status(406)
          .json({
            mensagem: mensagens
          });
      }
      usuarioLogin.senha = criptografia.criptografar(senha);
      let usuarioLogado = await usuarioServices.login(usuarioLogin);
      if (!usuarioLogado || !usuarioLogado[0]) {
        const usuarioExistente = await usuarioServices.ContarPorUsuario(usuarioLogin);
        if (usuarioExistente) {
          return resposta.status(401).json({
            mensagem: "Senha incorreta."
          });
        }
        return resposta
          .status(401)
          .json({
            mensagem: "Esse usuário não existe."
          });
      }
      const { _id, perfil, idOficina } = usuarioLogado[0];
      const token = jwt.sign(
        {
          _id,
          perfil,
          idOficina,
        },
        process.env.APP_SECRET as string,
        {
          expiresIn: 300000
        }
      )
      usuarioLogado = {
        ...usuarioLogado[0],
        token,
      }
      return resposta
        .status(200)
        .json(usuarioLogado);

    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async efetuarLoginPorToken(requisicao: Request, resposta: Response) {
    const idUsuario = requisicao.body.idUsuario as string;
    try {
      const usuarioLogin = await usuarioServices.loginPorIdUsuario(idUsuario);
      if (!usuarioLogin) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao encontrar usuário."
          });
      }
      console.log(usuarioLogin)
      return resposta
        .status(200)
        .json(usuarioLogin[0]);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }
};