const jwt = require("jsonwebtoken");
const servicoValidacao = require("../services/servicoValidacao");

module.exports = {
  async autenticar(requisicao, resposta, proximo) {
    const { authorization } = requisicao.headers;
    console.log(authorization)
    if (!authorization) {
      return resposta
        .status(401)
        .json({
          mensagem: "Nenhum token informado"
        })
    }
    const partes = authorization.split(' ');
    if (partes.length !== 2) {
      return resposta
        .status(401)
        .json({
          mensagem: "Erro no token."
        })
    }
    const [esquema, token] = partes;
    if (!/^Bearer$/i.test(esquema)) {
      return resposta
        .status(401)
        .json({
          mensagem: "Token mal formatado."
        })
    }
    jwt.verify(token, process.env.APP_SECRET, (erro, valorDecodificado) => {
      if (erro) {
        return resposta
          .status(401)
          .json({
            mensagem: "Token inválido."
          })
      }
      const { idOficina } = valorDecodificado;
      if (servicoValidacao.validarIdDaOficina(idOficina).length) {
        return resposta
          .status(401)
          .json({
            mensagem: "Token inválido."
          })
      }
      requisicao.idOficina = idOficina;
      proximo();
    });
  }
}