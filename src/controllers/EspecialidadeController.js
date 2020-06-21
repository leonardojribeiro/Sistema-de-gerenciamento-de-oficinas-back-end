const Especialidade = require('../models/Especialidade');
const especialidadeServices = require('../services/especialidadeServices');


module.exports = class EspecidadeController {
  async index(requisicao, resposta) {
    const especialidade = await Especialidade.find();
    /*const especialidade = 
        [
            {
                _id: "5e7f8fdd0bd08a372c452678",
                descricao: "Mecânico",
            },
            {
                _id: "5e7f8fdd0bd08a372c4526a",
                descricao: "Mecân",
            }
        ]
    ;*/
    return resposta.json({ especialidade });
  }

  async inserirDadosDeEspecialidade(request, resposta) {
    const { descricao, idOficina } = request.body;

    const especialidadeASerInserida = {
      descricao,
      idOficina,
    };

    const mensagens = especialidadeServices.validar(especialidadeASerInserida);

    if(mensagens.length){
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    };

    const especialidadeExistenteNaOficina = await especialidadeServices.contarPorDescricaoEIdOficina(especialidadeASerInserida);

    if(especialidadeExistenteNaOficina){
      return resposta.status(406)
        .json({
          mensagem: "Especialidade já cadastrada."
        });
    }
    
    const especialidadeInserida = await especialidadeServices.inserir(especialidadeASerInserida);

    if(!especialidadeInserida){
      return resposta.status(500)
        .json({
          mensagem: "Especialidade não cadastrada."
        });
    }

    return resposta.status(201)
      .json({
        mensagem: "Especialidade cadastrada com sucesso."
      });
  }
};