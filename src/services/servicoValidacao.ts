import validacao from "../util/validacao";
import { IEndereco } from "../models/Endereco";

export default {
  validarIdDaOficina(idOficina: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idOficina) && mensagens.push("Id da oficina é obrigatório.")
      || !validacao.validarId(idOficina) && mensagens.push("Id da oficina inválido.");
    return mensagens;
  },
  validarIdDaOrdemDeServico(idOficina: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idOficina) && mensagens.push("Id da ordem de serviço é obrigatório.")
      || !validacao.validarId(idOficina) && mensagens.push("Id da ordem de serviço inválido.");
    return mensagens;
  },
  validarIdDaMarca(idMarca: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idMarca) && mensagens.push("Id da marca é obrigatório.")
      || !validacao.validarId(idMarca) && mensagens.push("Id da marca inválido.");
    return mensagens;
  },
  validarIdDoModelo(idModelo: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idModelo) && mensagens.push("Id do modelo é obrigatório.")
      || !validacao.validarId(idModelo) && mensagens.push("Id do modelo inválido.");
    return mensagens;
  },
  validarIdDaPeca(idPeca: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idPeca) && mensagens.push("Id da peça é obrigatório.")
      || !validacao.validarId(idPeca) && mensagens.push("Id da peça inválido.");
    return mensagens;
  },
  validarIdDoCliente(idCliente: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idCliente) && mensagens.push("Id do cliente é obrigatório.")
      || !validacao.validarId(idCliente) && mensagens.push("Id do cliente inválido.");
    return mensagens;
  },

  validarIdDaEspecialidade(idEspecialidade: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idEspecialidade) && mensagens.push("Id da especialidade é obrigatório.")
      || !validacao.validarId(idEspecialidade) && mensagens.push("Id da especialidade inválido.");
    return mensagens;
  },

  validarIdDoVeiculo(idVeiculo: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idVeiculo) && mensagens.push("Id do veículo é obrigatório.")
      || !validacao.validarId(idVeiculo) && mensagens.push("Id do veículo inválido.");
    return mensagens;
  },

  validarIdDoFornecedor(idFornecedor: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idFornecedor) && mensagens.push("Id do fornecedor é obrigatório.")
      || !validacao.validarId(idFornecedor) && mensagens.push("Id do fornecedor inválido.");
    return mensagens;
  },

  validarIdDoFuncionario(idFuncionario: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idFuncionario) && mensagens.push("Id do funcionário é obrigatório.")
      || !validacao.validarId(idFuncionario) && mensagens.push("Id do funcionário inválido.");
    return mensagens;
  },

  validarIdDoServico(idServico: string) {
    const mensagens: string[] = [];
    !validacao.validarTexto(idServico) && mensagens.push("Id do serviço é obrigatório.")
      || !validacao.validarId(idServico) && mensagens.push("Id do serviço inválido.");
    return mensagens;
  },

  validarEndereco(endereco: IEndereco) {
    const mensagens: string[] = [];
    if (endereco) {
      !validacao.validarTexto(endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
      !validacao.validarTexto(endereco.numero) && mensagens.push("Número é obrigatório.");
      !validacao.validarTexto(endereco.bairro) && mensagens.push("Bairro é obrigatório.");
      !validacao.validarTexto(endereco.cep) && mensagens.push("CEP é obrigatório.")
        || !validacao.validarCep(endereco.cep) && mensagens.push("CEP inválido.");
      !validacao.validarTexto(endereco.cidade) && mensagens.push("Cidade é obrigatória.");
      !validacao.validarTexto(endereco.estado) && mensagens.push("Estado é obrigatório");
    }
    else {
      mensagens.push("Informações do endereço são obrigatórias.");
    }
    return mensagens;
  }
}