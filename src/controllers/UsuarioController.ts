import usuarioServices from "../services/UsuarioServices";
import criptografia from "../util/Criptografia";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { IUsuario } from "../models/Usuario";
import { } from 'mongoose';

export default {
  async incluirUsuario(requisicao: Request, resposta: Response) {
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
      const mensagens = usuarioServices.validarUsuarioASerIncluido(usuarioASerInserido);
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
      const usuarioInserido = await usuarioServices.incluirUsuario(usuarioASerInserido);
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
  },

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
      let usuarioLogado: any = await usuarioServices.login(usuarioLogin);
      console.log(usuarioLogado)
      if (!usuarioLogado) {
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
      else {
        usuarioLogado = {
          ...usuarioLogado?._doc,
          oficina: usuarioLogado?.idOficina,
          idOficina: usuarioLogado?.idOficina._id,
        }
      }
      const { _id, perfil, idOficina } = usuarioLogado;
      const token = jwt.sign(
        {
          _id,
          perfil,
          idOficina,
        },
        process.env.APP_SECRET as string,
        {
          expiresIn: Number(process.env.JWT_DURATION)
        }
      )
      usuarioLogado = {
        ...usuarioLogado,
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
  },

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
      return resposta
        .status(200)
        .json(usuarioLogin[0]);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  },
};