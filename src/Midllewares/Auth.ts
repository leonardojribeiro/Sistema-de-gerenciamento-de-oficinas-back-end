import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import servicoValidacao from "../services/servicoValidacao";

interface DecodedToken {
  _id: string;
  perfil: number;
  idOficina: string
}

export default async function autenticar(requisicao: Request, resposta: Response, proximo: NextFunction) {
  const authorization = requisicao.headers.authorization as string;
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
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET as string);
    if (decoded) {
      const { idOficina, _id, } = decoded as DecodedToken;
      requisicao.body.idOficina = idOficina;
      requisicao.body.idUsuario = _id;
      return proximo();
    }
  }
  catch (error) {
    console.log(error);
    return resposta
      .status(401)
      .json({
        mensagem: "Token inválido."
      })
  }
}