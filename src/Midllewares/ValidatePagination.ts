import { NextFunction, Request, Response } from "express";
import validacao from "../util/validacao";

export default function validatePagination(request: Request, response: Response, next: NextFunction) {
  const pagina = Number(request.query.pagina);
  const limite = Number(request.query.limite);
  try {
    if (!validacao.validarPaginacao(pagina, limite)) {
      return response.status(400).send();
    }
    request.query.pular = String((pagina - 1) * limite);
    return next();
  }
  catch (erro) {
    return response.status(400).send();
  }
}