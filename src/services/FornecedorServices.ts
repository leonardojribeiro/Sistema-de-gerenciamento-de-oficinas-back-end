import { IFornecedor } from "../models/Fornecedor";
import validacao from "../util/validacao";
import servicoValidacao from "./servicoValidacao";
import Fornecedor from '../models/Fornecedor';

export default class FornecedorServices {
  validarFornecedorASerInserido(informacoesDoFornecedor: IFornecedor) {
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
    !validacao.validarTexto(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(informacoesDoFornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(informacoesDoFornecedor.telefoneFixo) &&
      !validacao.validarTelefone(informacoesDoFornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(informacoesDoFornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    validacao.validarTexto(informacoesDoFornecedor.email) &&
      !validacao.validarEmail(informacoesDoFornecedor.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(informacoesDoFornecedor.endereco));
    mensagens.push(...servicoValidacao.validarIdDoFornecedor(informacoesDoFornecedor._id))
    return mensagens;
  }

  async contarFornecedoresPorCpfCnpjEIdOficina(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .countDocuments({
        cpfCnpj: informacoesDoFornecedor.cpfCnpj,
        oficina: informacoesDoFornecedor.oficina,
      });
  }

  async inserirFornecedor(informacoesDoFornecedor: IFornecedor) {
    return await Fornecedor
      .create(informacoesDoFornecedor);
  }

  async listarPorIdOficina(oficina: string) {
    return await Fornecedor
      .find({
        oficina
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