import validacao from "../util/validacao";
import Especialidade, { IEspecialidade } from "../models/Especialidade";
import servicoValidacao from "./servicoValidacao";

export default class EspecialidadeServices {

  validarEspecialidadeASerIncluida(informacoesDaEspecialidade: IEspecialidade) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDaEspecialidade.descricao) && mensagens.push("Descrição é obrigatório");
    return mensagens;
  }

  validarEspecialidadeASerAlterada(informacoesDaEspecialidade: IEspecialidade) {
    const mensagens: string[] = [];
    mensagens.push(...this.validarEspecialidadeASerIncluida(informacoesDaEspecialidade));
    mensagens.push(...servicoValidacao.validarIdDaEspecialidade(informacoesDaEspecialidade._id));
    return mensagens;
  }


  async incluirEspecialidade(informacoesDaEspecialidade: IEspecialidade) {
    return await Especialidade
      .create(informacoesDaEspecialidade)
  }

  async contarPorDescricaoEIdOficina(informacoesDaEspecialidade: IEspecialidade) {
    return await Especialidade
      .countDocuments({
        descricao: informacoesDaEspecialidade.descricao,
        oficina: informacoesDaEspecialidade.oficina,
      })
  }

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Especialidade
      .find({ oficina })
      .skip(pular)
      .limit(limite);
  }

  async contarPorOficina(oficina: string,) {
    return await Especialidade
      .countDocuments({ oficina });
  }

  async consultar(oficina: string, descricao: string, pular: number, limite: number) {
    return await Especialidade
      .find({
        oficina,
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        }
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorConsulta(oficina: string, descricao: string,) {
    return await Especialidade
      .countDocuments({
        oficina,
        descricao: {
          $regex: `^${descricao}`,
          $options: "i",
        }
      });
  }

  async listarPorIdEspecialidadeEIdOficina(oficina: string, _id: string) {
    return await Especialidade
      .findOne({
        oficina,
        _id,
      })
  }

  async alterarEspecialidade(informacoesDaEspecialidade: IEspecialidade) {
    return await Especialidade
      .updateOne(
        {
          _id: informacoesDaEspecialidade._id
        },
        {
          $set: informacoesDaEspecialidade
        }
      )
  }
}