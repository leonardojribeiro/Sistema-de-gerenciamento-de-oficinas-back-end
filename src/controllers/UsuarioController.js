const usuarioServices = require("../services/usuarioServices");
const criptografia = require("../util/Criptografia");
const jwt = require("jsonwebtoken");


module.exports = class UsuarioController {

  async incluirDadosDeUsuario(requisicao, resposta) {
    const { usuario, senha, perfil, idOficina, } = requisicao.body;

    const usuarioASerInserido = {
      usuario,
      senha,
      perfil,
      idOficina,
    };
    
    const mensagens = usuarioServices.validarUsuarioASerInserido(usuarioASerInserido);

    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    const usuarioExistenteNaOficina = await usuarioServices.contarPorOficinaEUsuario(usuarioASerInserido);

    if (usuarioExistenteNaOficina) {
      return resposta.status(406)
        .json({
          mensagem: "Este usuário já está cadastrado nessa oficina."
        });
    }

    usuarioASerInserido.senha = criptografia.criptografar(usuarioASerInserido.senha);

    const usuarioInserido = await usuarioServices.inserir(usuarioASerInserido);

    if (!usuarioInserido) {
      return resposta.status(500)
        .json({
          mensagem: "Usuário não cadastrado."
        });
    }

    return resposta.status(201)
      .json({
        mensagem: "Usuário cadastrado com sucesso."
      });
  }

  async efetuarLogin(requisicao, resposta) {
    const { usuario, senha, } = requisicao.body;

    const usuarioLogin = {
      usuario,
      senha,
    }

    const mensagens = usuarioServices.validarUsuarioLogin(usuarioLogin);

    if (mensagens.length) {
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    usuarioLogin.senha = criptografia.criptografar(senha);

    let usuarioLogado = await usuarioServices.login(usuarioLogin);

    if (!usuarioLogado) {
      const usuarioExistente = await usuarioServices.ContarPorUsuario(usuarioLogin);
      if(usuarioExistente){
        return resposta.status(401).json({
          mensagem: "Senha incorreta."
        });
      }
      return resposta.status(401)
        .json({
          mensagem: "Esse usuário não existe."
        });
    }

    const { _id } = usuarioLogado;

    usuarioLogado = {
      ...usuarioLogado._doc,
      token: jwt.sign({ _id }, process.env.APP_SECRET, { expiresIn: 3000 }),
    }

    return resposta.status(200).json(usuarioLogado);
  }

  async efetuarLoginPorToken(requisicao, resposta) {
    const {
      token
    } = requisicao.body;


    if (!token) {
      return resposta.status(401)
        .json({
          mensagem: "Token não informado."
        })
    };

    const _id = usuarioServices.autenticar(token);

    if (!_id) {
      return resposta.status(401)
        .json({
          mensagem: "Token inválido."
        });
    }

    const usuarioLogin = await usuarioServices.loginPorIdUsuario(_id);

    if (!usuarioLogin) {
      return resposta.status(500)
        .json({
          mensagem: "Erro ao encontrar usuário."
        });
    }
    return resposta.status(200).json(usuarioLogin);
  }

  async autenticar(requisicao, resposta, proximo) {
    const {
      token
    } = requisicao.body;

    if (!token) {
      return resposta.status(401)
        .json({
          mensagem: "Token não informado."
        })
    };

    const _id = usuarioServices.autenticar(token);

    if (!_id) {
      return resposta.status(401)
        .json({
          mensagem: "Token inválido."
        });
    }

    const usuario = await usuarioServices.listarPerfilDeUsuarioEIdOficinaPorIdUsuario(_id);

    if (!usuario) {
      return resposta.status(500)
        .json({
          mensagem: "Erro ao encontrar usuário."
        });
    }

    requisicao.body.usuario = usuario



    proximo();
  }

  teste(req, res) {
    console.log(req.body);
    return res.status(200).json({});
  }
};