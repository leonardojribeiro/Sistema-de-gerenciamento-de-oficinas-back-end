const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const validacao = require("../util/validacao");
const mongoose = require("mongoose")

module.exports = {

  validarUsuarioASerInserido(usuarioASerInserido) {
    const mensagens = [];
    !validacao.validarTexto(usuarioASerInserido.nomeUsuario) && mensagens.push("Usuário é obrigatório.");
    !validacao.validarTexto(usuarioASerInserido.senha) && mensagens.push("Senha é obrigatória.")
      || !validacao.validarSenha(usuarioASerInserido.senha) && mensagens.push("Senha inválida.");
    !validacao.validarNumero(usuarioASerInserido.perfil) && mensagens.push("Perfil de usuário é obrigatório.");
    !validacao.validarTexto(usuarioASerInserido.idOficina) && mensagens.push("Id da oficina é obrigatória.");
    return mensagens;
  },

  validarUsuarioLogin(usuarioLogin) {
    const mensagens = [];
    !validacao.validarTexto(usuarioLogin.nomeUsuario) && mensagens.push("Usuário é obrigatório.");
    !validacao.validarTexto(usuarioLogin.senha) && mensagens.push("Senha é obrigatória.")
    return mensagens;
  },

  async inserir(usuario) {
    return await Usuario
      .create(usuario)
      .catch(erro => {
        console.log(erro);
      });
  },

  async contarPorOficinaEUsuario(usuario) {
    return await Usuario
      .countDocuments({
        nomeUsuario: usuario.nomeUsuario,
        idOficina: usuario.idOficina,
      })
      .catch(erro => {
        console.log(erro)
      })
  },

  async ContarPorUsuario(usuario) {
    return await Usuario
      .countDocuments({
        nomeUsuario: usuario.nomeUsuario,
      })
      .catch(erro => {
        console.log(erro)
      });
  },

  async login(usuario) {
    return await Usuario
      .aggregate()
      .lookup({
        from: "oficinas",
        localField: "idOficina",
        foreignField: "_id",
        as: "oficina",
      })
      .match({
        nomeUsuario: usuario.nomeUsuario,
        senha: usuario.senha
      })
      .project({
        senha: 0,
        idOficina: 0
      })
      .unwind("oficina")
      .catch(erro => {
        console.log(erro)
      })
  },

  async listarPerfilDeUsuarioEIdOficinaPorIdUsuario(id) {
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
      })
      
      .catch(erro => {
        console.log(erro)
      })
  },

  async loginPorIdUsuario(id) {
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
      .catch(erro => {
        console.log(erro)
      })
  },

  autenticar(token) {
    let erro;
    let decodificado;
    jwt.verify(token, process.env.APP_SECRET, (err, valorDecodificado) => {
      if (err) {
        erro = err;
      }
      else {
        decodificado = valorDecodificado;
      }
    });

    if (erro) {
      return null;
    }
    return decodificado;
  },

}