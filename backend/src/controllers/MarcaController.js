const Marca = require('../models/Marca');

class MarcaController {
    async index(requisicao, resposta) {

        console.log(process.env.APP_URL);
        const marca = await Marca.find().populate(
            
        ).then().catch(e => { console.log(e) });
        resposta.json({ marca: marca });
    }

    async salvar(req, res) {
        const {descricao} = req.body;
        const caminhoLogo = `${process.env.APP_URL}/files/${req.file.key}`
        const marca = await Marca.create({
            descricao,
            caminhoLogo,
        }).then(()=>{
            
        }).catch(e => { });
        return res.json({ marca: marca});
    }

    async listarPorDescricao(req, res){
        const {descricao} = req.query;
        console.log(descricao);
        const marca = await Marca.find({
                descricao:{
                    $regex: descricao,
                    $options: "i",
                }
        });
        return res.json({ marca: marca});
    }
    
    async listarPorId(req, res){
        const {_id} = req.query;
        console.log(req.params);
        const marca = await Marca.findOne({
            _id: _id
        });
        return res.json({ marca: marca});
    }

    async editar(req, res) {

        console.log(req);
    }
}

module.exports = MarcaController;