import validacao from "../util/validacao";
import Especialidade, { IEspecialidade } from "../models/Especialidade";
import servicoValidacao from "./servicoValidacao";

export default class EspecialidadeServices {

  validarEspecialidadeASerInserida(especialidade: IEspecialidade) {
    const mensagens: string[] = [];
    !validacao.validarTexto(especialidade.descricao) && mensagens.push("Descrição é obrigatório");
    return mensagens;
  }

  validarEspecialidadeASerAlterada(especialidade: IEspecialidade) {
    const mensagens: string[] = [];
    !validacao.validarTexto(especialidade.descricao) && mensagens.push("Descrição é obrigatório");
    mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade._id));
    return mensagens;
  }


  async inserir(especialidade: IEspecialidade) {
    return await Especialidade
      .create(especialidade)
  }

  async contarPorDescricaoEIdOficina(especialidade: IEspecialidade) {
    return await Especialidade
      .countDocuments({
        descricao: especialidade.descricao,
        oficina: especialidade.oficina,
      })
  }

  async listarPorIdOficina(oficina: string) {
    return await Especialidade
      .find({ oficina })
  }

  async listarPorIdEspecialidadeEIdOficina(informacoesDaEspecialidade: IEspecialidade) {
    return await Especialidade
      .findOne(informacoesDaEspecialidade)
  }

  async alterarEspecialidade(especialidade: IEspecialidade) {
    return await Especialidade
      .updateOne(
        {
          _id: especialidade._id
        },
        {
          $set: especialidade
        }
      )
  }
}