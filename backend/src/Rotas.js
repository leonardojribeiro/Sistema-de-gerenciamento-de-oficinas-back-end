const {Router} = require ("express");

const multer = require("multer");

const FuncionarioController = require('./controllers/FuncionarioController');
const EspecialidadeController = require('./controllers/EspecialidadeController');
const MarcaController = require("./controllers/MarcaController");
const ModeloController = require("./controllers/ModeloController");
const VeiculoController = require("./controllers/VeiculoController");

const funcionarioController = new FuncionarioController();
const especialidadeController = new EspecialidadeController();
const marcaController = new MarcaController();
const modeloController = new ModeloController();
const veiculoController = new VeiculoController();

const rotas = Router();

const multerConfig = require("./multer");

rotas.get('/funcionario',funcionarioController.index);

rotas.post('/funcionario',funcionarioController.salvar);

rotas.get('/marca',marcaController.index);

rotas.get('/marca/descricao/',marcaController.listarPorDescricao);

rotas.get('/marca/id/',marcaController.listarPorId);

rotas.post('/marca', multer(multerConfig).single("logomarca"), marcaController.salvar);

rotas.put('/marca', );

rotas.get('/modelo',modeloController.index);

rotas.post('/modelo',modeloController.salvar);

rotas.get('/veiculo',veiculoController.index);

rotas.post('/veiculo',veiculoController.salvar);

rotas.put('/funcionario',funcionarioController.editar);

rotas.get('/especialidade',especialidadeController.index);

rotas.post('/especialidade', especialidadeController.salvar);

module.exports = rotas;