const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const validacao = require("../util/validacao");

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

  async ContarPorUsuario(usuario){
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
      .findOne(
        usuario
      )
      .populate({path: "idOficina" })
      .select({
        nomeUsuario: 1,
        perfil: 1,
        idOficina: 1,
      })
      .catch(erro => {
        console.log(erro)
      });
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
      .findOne({
        _id: id
      })
      .populate({
        path: 'idOficina',
      })
      .select({
        nomeUsuario: 1,
        perfil: 1,
        idOficina: 1,
      })
      .catch(erro => {
        console.log(erro)
      })
  },

  autenticar(token) {
    let erro;
    let _id;
    jwt.verify(token, process.env.APP_SECRET, (err, decodificado) => {
      if (err) {
        erro = err;
      }
      else {
        _id = decodificado._id;
      }
    });

    if (erro) {
      console.log(erro);
      return null;
    }
    return _id;
  },

}