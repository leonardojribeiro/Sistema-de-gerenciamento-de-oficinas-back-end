import { ICliente } from "../models/Cliente";

import validacao from "../util/validacao";
import Cliente from "../models/Cliente";
import servicoValidacao from "./servicoValidacao";

export default class ClienteServices {
  validarClienteASerIncluido(informacoesDoCliente: ICliente) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoCliente.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarData(informacoesDoCliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    !validacao.validarTexto(informacoesDoCliente.cpfCnpj) && mensagens.push("CPF/CNPJ é obrigatório.")
      || !validacao.validarCpfCnpj(informacoesDoCliente.cpfCnpj) && mensagens.push("CPF/CNPJ inválido");
    validacao.validarTexto(informacoesDoCliente.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoCliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoCliente.email) &&
      !validacao.validarEmail(informacoesDoCliente.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoCliente.endereco));
    return mensagens;
  }

  validarClienteASerAlterado(informacoesDoCliente: ICliente) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoCliente.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarData(informacoesDoCliente.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
    validacao.validarTexto(informacoesDoCliente.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoCliente.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoCliente.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoCliente.email) &&
      !validacao.validarTexto(informacoesDoCliente.email) && !validacao.validarEmail(informacoesDoCliente.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoCliente.endereco));
    return mensagens;
  }

  async incluirCliente(informacoesDoCliente: ICliente) {
    return await Cliente
      .create(informacoesDoCliente);
  }

  async contarClientesPorCpfEIdOficina(informacoesDoCliente: ICliente) {
    return await Cliente
      .countDocuments({
        cpfCnpj: informacoesDoCliente.cpfCnpj,
        oficina: informacoesDoCliente.oficina,
      });
  }

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Cliente
      .find({
        oficina
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorOficina(oficina: string) {
    return await Cliente
      .countDocuments({
        oficina
      });
  }

  async consultar(oficina: string, nome: string = "", cpfCnpj: string = "", email: string = "", telefone: string = "", pular: number, limite: number) {
    return await Cliente
      .find({
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
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorConsulta(oficina: string, nome: string = "", cpfCnpj: string = "", email: string = "", telefone: string = "") {
    return await Cliente
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
  }

  async listarPorIdClienteEIdOficina(informacoesDoCliente: ICliente) {
    return await Cliente
      .findOne(informacoesDoCliente)
      .select({
        oficina: 0,
        __v: 0,

      });
  }

  async alterarCliente(informacoesDoCliente: ICliente) {
    return await Cliente
      .updateOne(
        {
          _id: informacoesDoCliente._id
        },
        {
          $set: informacoesDoCliente,
        },
      );
  }
}