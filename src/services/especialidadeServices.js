const validacao = require("../util/validacao");
const { inserir, contarPorDescricaoEIdOficina, listarPorIdOficina } = require("./MarcaServices");
const Especialidade = require("../models/Especialidade");
const servicoValidacao = require("./servicoValidacao");


module.exports = class EspecialidadeServices {

  validarEspecialidadeASerInserida(especialidade) {
    const mensagens = [];
    !validacao.validarTexto(especialidade.descricao) && mensagens.push("Descrição é obrigatório");
    mensagens.push(...servicoValidacao.validarIdDaOficina(especialidade.idOficina))
    return mensagens;
  }

  validarEspecialidadeASerAlterada(especialidade){
    const mensagens = [];
    !validacao.validarTexto(especialidade.descricao) && mensagens.push("Descrição é obrigatório");
    mensagens.push(...servicoValidacao.validarIdDaOficina(especialidade.idOficina));
    mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade._id));
    return mensagens;
  }

  validarIdEspecialidadeEIdOficina(especialidade){
    const mensagens = [];
    mensagens.push(...servicoValidacao.validarIdDaOficina(especialidade.idOficina));
    mensagens.push(...servicoValidacao.validarIdDaEspecialidade(especialidade._id));
    return mensagens;
  }

  async inserir(especialidade, opt) {
    return await Especialidade
      .create([especialidade], opt)
      .catch(erro => {
        console.log(erro);
      });
  }

  async contarPorDescricaoEIdOficina(especialidade) {
    return await Especialidade
      .countDocuments({
        descricao: especialidade.descricao,
        idOficina: especialidade.idOficina,
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  async listarPorIdOficina(idOficina){
    return await Especialidade
    .find({idOficina})
    .catch(erro => console.log(erro))
  }

  async listarPorIdEspecialidadeEIdOficina(informacoesDaEspecialidade){
    return await Especialidade
    .findOne(informacoesDaEspecialidade)
    .catch(erro => console.log(erro));
  }

  async alterarEspecialidade(especialidade){
    return await Especialidade
    .updateOne(
      {
        _id: especialidade._id
      },
      {
        $set: especialidade
      }
    )
    .catch(erro =>  console.log(erro));
  }
}