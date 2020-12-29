import { IFornecedor } from "../models/Fornecedor";
import validacao from "../util/validacao";
import servicoValidacao from "./servicoValidacao";
import Fornecedor from '../models/Fornecedor';

export default class FornecedorServices {
  validarFornecedorASerIncluido(informacoesDoFornecedor: IFornecedor) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoFornecedor.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(informacoesDoFornecedor.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFornecedor.email) &&
      !validacao.validarEmail(informacoesDoFornecedor.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFornecedor.endereco));
    return mensagens;
  }

  validarFornecedorASerAlterado(informacoesDoFornecedor: IFornecedor) {
    const mensagens: string[] = [];
    !validacao.validarTexto(informacoesDoFornecedor.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    validacao.validarTexto(informacoesDoFornecedor.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFornecedor.email) &&
      !validacao.validarEmail(informacoesDoFornecedor.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarIdDoFornecedor(informacoesDoFornecedor._id));
    return mensagens;
  }

  async contarFornecedoresPorCpfCnpjEIdOficina(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .countDocuments({
        cpfCnpj: informacoesDoFornecedor.cpfCnpj,
        oficina: informacoesDoFornecedor.oficina,
      });
  }

  async incluirFornecedor(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .create(informacoesDoFornecedor);
  }

  async listarPorOficina(oficina: string, pular: number, limite: number) {
    return await Fornecedor
      .find({
        oficina
      })
      .skip(pular)
      .limit(limite);
  }

  async contarPorOficina(oficina: string) {
    return await Fornecedor
      .countDocuments({
        oficina
      });
  }

  async consultar(oficina: string, nome: string = "", cpfCnpj: string = "", email: string = "", telefone: string = "", pular: number, limite: number) {
    return await Fornecedor
      .find({
        oficina,
        nomeFantasia: {
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
    return await Fornecedor
      .countDocuments({
        oficina,
        nomeFantasia: {
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

  async listarPorIdFornecedorEIdOficina(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .findOne(informacoesDoFornecedor);
  }

  async alterarFornecedor(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .updateOne(
        {
          _id: informacoesDoFornecedor._id,
        },
        {
          $set: informacoesDoFornecedor
        }
      );
  }
}