import { IFuncionario } from "../models/Funcionario";
import validacao from "../util/validacao";
import Funcionario from "../models/Funcionario";
import servicoValidacao from "./servicoValidacao";
import { Types } from "mongoose";


export default {
  validarIdsEspecialidades(especialidades: string[]) {
    const mensagens: string[] = [];
    if (!especialidades) {
      mensagens.push("Especialidades são obrigatórias")
    }
    else if (!especialidades.length) {
      mensagens.push("Deve ter pelo menos uma especialidade")
    }
    else {
      especialidades.forEach((especialidade) => {
        mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade))
      })
    }
    return mensagens;
  },

  validarFuncionarioASerIncluido(informacoesDoFuncionario: IFuncionario) {
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
    mensagens.push(...this.validarIdsEspecialidades(informacoesDoFuncionario.especialidades));
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFuncionario.endereco));
    return mensagens;
  },

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
    mensagens.push(...this.validarIdsEspecialidades(informacoesDoFuncionario.especialidades));
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFuncionario.endereco));
    mensagens.push(...servicoValidacao.validarIdDoFuncionario(informacoesDoFuncionario._id));
    return mensagens;
  },

  async contarFuncionariosPorCpfEIdOficina(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .countDocuments({
        cpf: informacoesDoFuncionario.cpf,
        oficina: informacoesDoFuncionario.oficina,
      })
  },

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Funcionario
      .find({
        oficina
      })
      .populate({
        path: "especialidades"
      })
      .skip(pular)
      .limit(limite);
  },

  async contarPorOficina(oficina: string) {
    return await Funcionario
      .countDocuments({
        oficina
      });
  },

  async consultar(oficina: string, nome: string = "", cpf: string = "", email: string = "", telefone: string = "", pular: number, limite: number) {
    return await Funcionario
      .find({
        oficina,
        nome: {
          $regex: `^${nome}`,
          $options: "i",
        },
        cpf: {
          $regex: `^${cpf}`,
          $options: "i",
        },
        email: {
          $regex: `^${email}`,
          $options: "i",
        },
        $or: [
          {
            telefoneCelular: {
              $regex: `^${telefone}`,
              $options: "i",
            }
          },
          {
            telefoneFixo: {
              $regex: `^${telefone}`,
              $options: "i",
            }
          },
        ]
      })
      .populate({
        path: "especialidades",
      })
      .skip(pular)
      .limit(limite);
  },

  async contarPorConsulta(oficina: string, nome: string = "", cpfCnpj: string = "", email: string = "", telefone: string = "") {
    return await Funcionario
      .countDocuments({
        oficina,
        nome: {
          $regex: `^${nome}`,
          $options: "i",
        },
        cpfCnpj: {
          $regex: `^${cpfCnpj}`,
          $options: "i",
        },
        email: {
          $regex: `^${email}`,
          $options: "i",
        },
        $or: [
          {
            telefoneCelular: {
              $regex: `^${telefone}`,
              $options: "i",
            }
          },
          {
            telefoneFixo: {
              $regex: `^${telefone}`,
              $options: "i",
            }
          },
        ]
      });
  },

  async listarPorIdFuncionarioEIdOficina(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .aggregate()
      .lookup({
        from: 'especialidades',
        localField: 'especialidades',
        foreignField: '_id',
        as: 'especialidades'
      })
      .match({
        _id: Types.ObjectId(informacoesDoFuncionario._id),
        oficina: Types.ObjectId(informacoesDoFuncionario.oficina),
      })
      .project({
        'especialidades.oficina': 0,
        'especialidades.__v': 0,
        oficina: 0,
        __v: 0
      });
  },

  async incluirFuncionario(informacoesDoFuncionario: IFuncionario) {
    return await Funcionario
      .create(informacoesDoFuncionario)
  },

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
  },
}