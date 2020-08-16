import { IFuncionario } from "../models/Funcionario";
import validacao from "../util/validacao";
import Funcionario from "../models/Funcionario";
import servicoValidacao from "./servicoValidacao";
import { Types } from "mongoose";


export default class FuncionarioServices {
  validarIdsEspecialidades(idsEspecialidades: string[]) {
    const mensagens: string[] = [];
    if (!idsEspecialidades) {
      mensagens.push("Especialidades são obrigatórias")
    }
    else if (!idsEspecialidades.length) {
      mensagens.push("Deve ter pelo menos uma especialidade")
    }
    else {
      idsEspecialidades.forEach((especialidade) => {
        mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade))
      })
    }
    return mensagens;
  }

  validarFuncionarioASerInserido(informacoesDoFuncionario: IFuncionario) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoFuncionario.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarData(informacoesDoFuncionario.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    !validacao.validarTexto(informacoesDoFuncionario.cpf) && mensagens.push("CPF é obrigatório.")
      || !validacao.validarCpfCnpj(informacoesDoFuncionario.cpf) && mensagens.push("CPF inválido");
    validacao.validarTexto(informacoesDoFuncionario.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFuncionario.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFuncionario.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFuncionario.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFuncionario.email) &&
      !validacao.validarTexto(informacoesDoFuncionario.email) && !validacao.validarEmail(informacoesDoFuncionario.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...this.validarIdsEspecialidades(informacoesDoFuncionario.idsEspecialidades));
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFuncionario.endereco));
    return mensagens;
  }

  validarClienteASerAlterado(informacoesDoFuncionario: IFuncionario) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoFuncionario.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarData(informacoesDoFuncionario.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    validacao.validarTexto(informacoesDoFuncionario.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFuncionario.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFuncionario.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFuncionario.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFuncionario.email) &&
      !validacao.validarTexto(informacoesDoFuncionario.email) && !validacao.validarEmail(informacoesDoFuncionario.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...this.validarIdsEspecialidades(informacoesDoFuncionario.idsEspecialidades));
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFuncionario.endereco));
    return mensagens;
  }

  async contarFuncionariosPorCpfEIdOficina(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .countDocuments({
        cpf: informacoesDoFuncionario.cpf,
        idOficina: informacoesDoFuncionario.idOficina,
      })
  }

  async listarPorIdOficina(idOficina: string) {
    return await Funcionario
      .aggregate()
      .lookup({
        from: 'especialidades',
        localField: 'idsEspecialidades',
        foreignField: '_id',
        as: 'especialidades'
      })
      .match({
        idOficina: Types.ObjectId(idOficina),
      })
      .project({
        'especialidades.idOficina': 0,
        'especialidades.__v': 0,
        idOficina: 0,
        __v: 0
      });
  }

  async listarPorIdFuncionarioEIdOficina(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .aggregate()
      .lookup({
        from: 'especialidades',
        localField: 'idsEspecialidades',
        foreignField: '_id',
        as: 'especialidades'
      })
      .match({
        _id: Types.ObjectId(informacoesDoFuncionario._id),
        idOficina: Types.ObjectId(informacoesDoFuncionario.idOficina),
      })
      .project({
        'especialidades.idOficina': 0,
        'especialidades.__v': 0,
        idOficina: 0,
        __v: 0
      });
  }

  async inserirFuncionario(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .create(informacoesDoFuncionario)
  }

  async alterarFuncionario(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .updateOne(
        {
          _id: informacoesDoFuncionario._id,
        },
        {
          $set: informacoesDoFuncionario
        }
      )
  }
}