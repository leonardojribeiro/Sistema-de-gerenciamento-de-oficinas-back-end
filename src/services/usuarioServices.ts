import Usuario, { IUsuario } from "../models/Usuario";
import validacao from "../util/validacao";
import mongoose from "mongoose";

export default {

  validarUsuarioASerIncluido(informacoesDoUsuario: IUsuario) {
    const mensagens: string[] = []
    !validacao.validarTexto(informacoesDoUsuario.nomeUsuario) && mensagens.push("Usuário é obrigatório.");
    !validacao.validarTexto(informacoesDoUsuario.senha) && mensagens.push("Senha é obrigatória.")
      || !validacao.validarSenha(informacoesDoUsuario.senha) && mensagens.push("Senha inválida.");
    !validacao.validarNumero(informacoesDoUsuario.perfil) && mensagens.push("Perfil de usuário é obrigatório.");
    !validacao.validarTexto(informacoesDoUsuario.idOficina) && mensagens.push("Id da oficina é obrigatória.");
    return mensagens;
  },

  validarUsuarioLogin(usuarioLogin: IUsuario) {
    const mensagens: string[] = []
    !validacao.validarTexto(usuarioLogin.nomeUsuario) && mensagens.push("Usuário é obrigatório.");
    !validacao.validarTexto(usuarioLogin.senha) && mensagens.push("Senha é obrigatória.")
    return mensagens;
  },

  async incluirUsuario(informacoesDoUsuario: IUsuario) {
    return await Usuario
      .create(informacoesDoUsuario)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorOficinaEUsuario(informacoesDoUsuario: IUsuario) {
    return await Usuario
      .countDocuments({
        nomeUsuario: informacoesDoUsuario.nomeUsuario,
        idOficina: informacoesDoUsuario.idOficina,
      });
  },

  async ContarPorUsuario(informacoesDoUsuario: IUsuario) {
    return await Usuario
      .countDocuments({
        nomeUsuario: informacoesDoUsuario.nomeUsuario,
      });
  },

  async login(informacoesDoUsuario: IUsuario) {
    return await Usuario
      .aggregate()
      .lookup({
        from: "oficinas",
        localField: "idOficina",
        foreignField: "_id",
        as: "oficina",
      })
      .match({
        nomeUsuario: informacoesDoUsuario.nomeUsuario,
        senha: informacoesDoUsuario.senha
      })
      .project({
        senha: 0,
        __v: 0
      })
      .unwind("oficina");
  },

  async listarPerfilDeUsuarioEIdOficinaPorIdUsuario(id: string) {
    return await Usuario
      .findOne({
        _id: id
      })
      .populate({
        path: 'idOficina',
        select: "_id"
      })
      .select({
        perfil: 1,
      });
  },

  async loginPorIdUsuario(id: string) {
    return await Usuario
      .aggregate()
      .lookup({
        from: "oficinas",
        localField: "idOficina",
        foreignField: "_id",
        as: "oficina",
      }
      )
      .match({
        _id: mongoose.Types.ObjectId(id)
      })
      .project({
        senha: 0,
        idOficina: 0
      })
      .unwind("oficina")
  },

}