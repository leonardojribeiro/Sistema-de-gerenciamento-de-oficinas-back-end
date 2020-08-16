const validacao = require("../util/validacao");
const Funcionario = require("../models/Funcionario");
const servicoValidacao = require("./servicoValidacao");
const { Types } = require("mongoose");


module.exports = class FuncionarioServices {
  validarIdsEspecialidades(idsEspecialidades = []) {
    const mensagens = [];
    if (!idsEspecialidades) {
      mensagens.push("Especialidades são obrigatórias")
    }
    else if (!idsEspecialidades.length) {
      mensagens.push("Deve ter pelo menos uma especialidade")
    }
    else{
      idsEspecialidades.forEach((especialidade)=>{
        mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade))
      })
    }
    return mensagens;
  }

  validarFuncionarioASerInserido(informacoesDoFuncionario) {
    const mensagens = [];
    !validacao.validarTexto(informacoesDoFuncionario.nome) && mensagens.push("Nome é obrigatório.");
    !validacao.validarTexto(informacoesDoFuncionario.dataNascimento) && mensagens.push("Data de nascimento é obrigatória.");
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

  async contarFuncionariosPorCpfEIdOficina(informacoesDoFuncionario) {
    return await Funcionario
      .countDocuments({
        cpf: informacoesDoFuncionario.cpf,
        idOficina: informacoesDoFuncionario.idOficina,
      })
      .catch(erro => console.log(erro))
  }

  async listarPorIdOficina(idOficina){
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
    })
    .catch(erro => console.log(erro))
  }

  async listarPorIdFuncionarioEIdOficina(informacoesDoFuncionario){
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
    })
    .catch(erro => console.log(erro))
  }

  async inserirFuncionario(funcionario) {
    return await Funcionario
      .create(funcionario)
      .catch(erro => {
        console.log(erro);
      })
  }
}