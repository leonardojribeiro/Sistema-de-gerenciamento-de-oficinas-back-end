const Veiculo = require('../models/Veiculo');

class VeiculoController {
    async index(requisicao, resposta) {
        console.log(requisicao.body);
        const {marca, modelo} = requisicao.body;
        const veiculo = await Veiculo.aggregate([
           {
                $lookup:{
                    from:"modelos",
                    localField: "modelo",
                    foreignField:"_id", 
                    as: "modelo",
                    
                },
            },
            {
                $lookup:{
                    from:"marcas",
                    localField: "modelo.marca",
                    foreignField:"_id",
                    as:"marca"
                }
            },
        ]).then().catch(e => { console.log(e) });
        resposta.json({ veiculo: veiculo });
    }

    async salvar(req, res) {
        console.log(req.body);
        const { placa, modelo } = req.body;
        const veiculo = await Veiculo.create({
            placa,
            modelo,
        }).then().catch(e => { });
        return res.json({ veiculo: veiculo });
    }

    async editar(req, res) {

        console.log(req.body);
        const { _id, nome, cpf, especialidade } = req.body;

        const funcionario = await Veiculo.update({
            _id,
            nome,
            cpf,
            especialidade
        }).then().catch(e => { });

        return res.json(funcionario);
    }
}

module.exports = VeiculoController;