const Modelo = require('../models/Modelo');

class ModeloController {
    async index(requisicao, resposta) {
        console.log("index modelo");
        const modelo = await Modelo.find().populate(
            {
                path: "marca",
                populate:{
                    path: "marca"
                }
            }
        ).then().catch(e => { console.log(e) });
        resposta.json({ modelo: modelo });
    }

    async salvar(req, res) {
        console.log(req.body);
        const { descricao, marca } = req.body;
        const modelo = await Modelo.create({
            descricao,
            marca,
        }).then().catch(e => { });
        return res.json({ modelo: modelo });
    }

    async editar(req, res) {

        console.log(req.body);
        const { _id, nome, cpf, especialidade } = req.body;

        const funcionario = await Modelo.update({
            _id,
            nome,
            cpf,
            especialidade
        }).then().catch(e => { });

        return res.json(funcionario);
    }
}

module.exports = ModeloController;