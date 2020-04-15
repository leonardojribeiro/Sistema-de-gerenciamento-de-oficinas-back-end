const Marca = require('../models/Marca');

class MarcaController {
    async index(requisicao, resposta) {

        console.log(process.env.APP_URL);
        const marca = await Marca.find().populate(

        ).then().catch(e => { console.log(e) });
        resposta.json({ marca: marca });
    }

    async salvar(req, res) {
        const { descricao } = req.body;
        const caminhoLogo = `${process.env.APP_URL}/files/${req.file.key}`
        const marca = await Marca.create({
            descricao,
            caminhoLogo,
        }).then(() => {

        }).catch(e => { });
        return res.json({ marca: marca });
    }

    async listarPorDescricao(req, res) {
        const { descricao } = req.query;
        console.log(descricao);
        const marca = await Marca.find({
            descricao: {
                $regex: descricao,
                $options: "i",
            }
        });
        return res.json({ marca: marca });
    }

    async listarPorModelo(req, res) {
        const { _id } = req.query;
        console.log(_id);
        const marca = await Marca.aggregate(
            [{
                $lookup: {
                    from: "modelos",
                    localField: "_id",
                    foreignField: "marca",
                    as: "modelo"
                }
            }, 
            {
                $match: {
                    "modelo._id": "5e9610cf5e5948367c4efbf3"
                }
            }]
        );
        return res.json({ marca: marca });
    }

    async listarPorId(req, res) {
        const { _id } = req.query;
        console.log(req.params);
        const marca = await Marca.findOne({
            _id: _id
        });
        return res.json({ marca: marca });
    }

    async alterar(req, res) {
        const { _id, descricao, caminhoLogo } = req.body;




        const marca = await Marca.updateOne(
            {
                _id
            },
            {
                descricao,
                caminhoLogo,
            }).then().catch(e => { console.log(e) });
        return res.json(marca);
    }
}

module.exports = MarcaController;