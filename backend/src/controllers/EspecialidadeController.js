const Especialidade = require('../models/Especialidade');


module.exports = class EspecidadeController{
    async index(requisicao, resposta){
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
        return resposta.json({especialidade});
    }

    async salvar(request, resposta){
        const {descricao} = request.body;
        console.log(request.body);
        const especialidade = await Especialidade.create({
            descricao
        }).then().catch(a=>{console.log(a)});
        return resposta.json({especialidade});
    }
};