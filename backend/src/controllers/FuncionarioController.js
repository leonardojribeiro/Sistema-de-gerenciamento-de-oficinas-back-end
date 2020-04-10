const Funcionario = require('../models/Funcionario');

class FuncionarioController {
    async index(requisicao, resposta) {
        console.log("index");
        const funcionarios = await Funcionario.aggregate(
            [{
                $lookup: {
                    from: "especialidades",
                    localField: "especialidade",
                    foreignField: "_id",
                    as: "esp"
                }
            }]
        ).then().catch(e => { console.log(e) });
        resposta.json({ funcionarios });
    }

    async salvar(req, res) {
        console.log(req.body);
        const { nome, cpf, especialidade } = req.body;
        const funcionario = await Funcionario.create({
            nome,
            cpf,
            especialidade
        }).then().catch(e => { });
        return res.json({ funcionario });
    }

    async editar(req, res) {

        console.log(req.body);
        const { _id, nome, cpf, especialidade } = req.body;

        const funcionario = await Funcionario.update({
            _id,
            nome,
            cpf,
            especialidade
        }).then().catch(e => { });

        return res.json(funcionario);
    }
}

module.exports = FuncionarioController;