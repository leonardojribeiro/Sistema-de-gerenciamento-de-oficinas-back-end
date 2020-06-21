const { Router } = require("express");

const multer = require("multer");

const FuncionarioController = require('./controllers/FuncionarioController');
const EspecialidadeController = require('./controllers/EspecialidadeController');
const MarcaController = require("./controllers/MarcaController");
const ModeloController = require("./controllers/ModeloController");
const VeiculoController = require("./controllers/VeiculoController");
const OficinaController = require("./controllers/OficinaController");
const UsuarioController = require("./controllers/UsuarioController");

const funcionarioController = new FuncionarioController();
const especialidadeController = new EspecialidadeController();
const marcaController = new MarcaController();
const modeloController = new ModeloController();
const veiculoController = new VeiculoController();
const oficinaController = new OficinaController();
const usuarioController = new UsuarioController();

const rotas = Router();

const multerConfig = require("./multer");
const ClienteController = require("./controllers/ClienteController");
const VinculoController = require("./controllers/VinculoController");

const upload = multer();

rotas.get("/", (req, res) => {
  res.json({ message: "olá mundo!" })
});

rotas.post(
  "/oficina/cadastroOficinaCandidata",
  multer(multerConfig).single("logomarca"),
  oficinaController.cadastroDeOficinaCandidata,
);

rotas.post(
  '/marca',
  multer(multerConfig).single("logomarca"),
  marcaController.incluirDadosDaMarca
);

rotas.post("/usuario", usuarioController.incluirDadosDeUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.post("/usuario/loginPorToken", usuarioController.efetuarLoginPorToken);

rotas.post("/usuario/auth", usuarioController.autenticar, usuarioController.teste);

rotas.post('/modelo', modeloController.incluirDadosDeModelo);

rotas.post('/veiculo', veiculoController.incluirDadosDeVeiculo);

rotas.post("/cliente", new ClienteController().inserirDadosDeCliente);

rotas.get('/funcionario', funcionarioController.index);

rotas.post('/funcionario', funcionarioController.salvar);

rotas.post("/vinculo", new VinculoController().incluir);

rotas.get('/marca', marcaController.index);

rotas.get('/marca/descricao/', marcaController.listarPorDescricao);

rotas.get('/marca/id/', marcaController.listarPorId);

rotas.get('/marca/modelo/', marcaController.listarPorModelo)


rotas.put('/marca', marcaController.alterar);

rotas.get('/modelo', modeloController.index);


rotas.get('/veiculo', veiculoController.index);


rotas.put('/funcionario', funcionarioController.editar);

rotas.get('/especialidade', especialidadeController.index);

rotas.post('/especialidade', especialidadeController.inserirDadosDeEspecialidade);


function of(r){
  return r.status(200).json({aaa: "ass"});
}

rotas.get('/teste', (req, res, next) => {
  console.log("midllaware 1");
  //return res.json("falhou")
  next();
},
  (req, res, next) => {
    console.log("midllaware 2");
    next();
  },
  (req, res) => {
    console.log("rota final");
    of(res);
    console.log("apos res");
    return
  })

rotas.get('/routeparams/:id/ok', (req, res) => {
  return res.json(req.params);
})

module.exports = rotas;