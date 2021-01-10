import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { Socket, } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import servicoValidacao from "../services/servicoValidacao";

interface DecodedToken {
  _id: string;
  perfil: number;
  idOficina: string
}

export default async function webSocketAuth(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
  try {
    const auth = socket.handshake.auth as any;
    const authorization = auth.token;
    if (!authorization) {
      return next(new Error("Nenhum token informado"));
    }
    const partes = authorization.split(' ');
    if (partes.length !== 2) {
      return next(new Error("Erro no token."));
    }
    const [esquema, token] = partes;
    if (!/^Bearer$/i.test(esquema)) {
      return next(new Error("Token mal formatado."));
    }
    const decoded = jwt.verify(token, process.env.APP_SECRET as string);
    if (decoded) {
      const { idOficina, _id, } = decoded as DecodedToken;
      socket.handshake.query = { oficina: idOficina, idUsuario: _id }
      return next();
    }
  }
  catch (error) {
    console.log(error);
    return next(new Error("Token inválido."));
  }
}