const { Router } = require("express");

const multer = require("multer");

const FuncionarioController = require('./controllers/FuncionarioController');
const EspecialidadeController = require('./controllers/EspecialidadeController');
const modeloController = require("./controllers/ModeloController");
const pecaController = require("./controllers/PecaController");
const VeiculoController = require("./controllers/VeiculoController");
const OficinaController = require("./controllers/OficinaController");
const UsuarioController = require("./controllers/UsuarioController");

const marcaController = require("./controllers/MarcaController");
const funcionarioController = new FuncionarioController();
const especialidadeController = new EspecialidadeController();
const veiculoController = new VeiculoController();
const oficinaController = new OficinaController();
const usuarioController = new UsuarioController();

const rotas = Router();

const multerConfig = require("./multer");
const clienteController = require("./controllers/ClienteController");
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


//marcas 
rotas.post(
  '/marca',
  multer(multerConfig).single("logomarca"),
  marcaController.incluirDadosDaMarca
);
rotas.get('/marca', marcaController.listarTodos);
rotas.get('/marca/descricao/', marcaController.listarPorDescricaoParcialEIdOficina);
rotas.get('/marca/id/', marcaController.listarMarcaPorId);
rotas.put('/marca',
  multer(multerConfig).single("logomarca"),
  marcaController.alterarMarca
);

//modelo
rotas.get('/modelo', modeloController.listarTodos);
rotas.post('/modelo', modeloController.incluirDadosDeModelo);
rotas.get('/modelo/consulta', modeloController.consultar);
rotas.get('/modelo/id', modeloController.listarModeloPorId);
rotas.put('/modelo', modeloController.alterarModelo);

//peças
rotas.get('/peca', pecaController.listarTodos);
rotas.post('/peca', pecaController.incluirDadosDePeca);
rotas.get('/peca/consulta', pecaController.consultar);
rotas.get('/peca/id', pecaController.listarPecaPorId);
rotas.put('/peca', pecaController.alterarPeca);

//clientes
rotas.post("/cliente", clienteController.inserirDadosDeCliente);
rotas.get('/cliente', clienteController.listarTodos);
rotas.get('/cliente/id', clienteController.listarPorId);
rotas.put('/cliente', clienteController.alterarCliente);

//veiculos
rotas.get('/veiculo', veiculoController.listarTodos);


rotas.post("/usuario", usuarioController.incluirDadosDeUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.post("/usuario/loginPorToken", usuarioController.efetuarLoginPorToken);

rotas.post("/usuario/auth", usuarioController.autenticar, usuarioController.teste);

rotas.post('/veiculo', veiculoController.incluirDadosDeVeiculo);


rotas.get('/funcionario', funcionarioController.index);

rotas.post('/funcionario', funcionarioController.salvar);

rotas.post("/vinculo", new VinculoController().incluir);




rotas.put('/funcionario', funcionarioController.editar);

rotas.get('/especialidade', especialidadeController.index);

rotas.post('/especialidade', especialidadeController.inserirDadosDeEspecialidade);


function of(r) {
  return r.status(200).json({ aaa: "ass" });
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