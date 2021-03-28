import Oficina, { IOficina } from "../models/Oficina";
import validacao from "../util/validacao";
import servicoValidacao from "./servicoValidacao";

export default {

  validar(oficina: IOficina) {
    const mensagens: string[] = [];
    !validacao.validarTexto(oficina.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(oficina.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(oficina.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(oficina.telefoneFixo) &&
      !validacao.validarTelefone(oficina.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(oficina.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(oficina.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    !validacao.validarTexto(oficina.email) && mensagens.push("E-mail é obrigatório.");
    !validacao.validarTexto(oficina.email) && !validacao.validarEmail(oficina.email) && mensagens.push("E-mail inválido.");
    mensagens.push(...servicoValidacao.validarEndereco(oficina.endereco));
    !validacao.validarNumero(oficina.localizacao.coordinates[1]) && mensagens.push("Latitude é obrigatória.");
    !validacao.validarNumero(oficina.localizacao.coordinates[0]) && mensagens.push("Longitude é obrigatória.");
    return mensagens;
  },

  async listarPorCpfCnpj(cpfCnpj: string) {
    return await Oficina
      .findOne({
        cpfCnpj,
      });
  },

  async listarPorEmail(email: string) {
    return await Oficina
      .findOne({
        email,
      });
  },

  async inserir(oficina: IOficina) {
    return await Oficina
      .create(oficina);
  },

}