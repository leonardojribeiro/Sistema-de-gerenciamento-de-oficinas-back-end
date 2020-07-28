const { Router } = require("express");

const multer = require("multer");

const modeloController = require("./controllers/ModeloController");
const pecaController = require("./controllers/PecaController");
const marcaController = require("./controllers/MarcaController");
const funcionarioController = require('./controllers/FuncionarioController');
const especialidadeController = require('./controllers/EspecialidadeController');
const clienteController = require("./controllers/ClienteController");
const servicoController = require("./controllers/ServicoController");
const fornecedorController = require("./controllers/FornecedorController");

const veiculoController = require("./controllers/VeiculoController");
const OficinaController = require("./controllers/OficinaController");
const UsuarioController = require("./controllers/UsuarioController");

const oficinaController = new OficinaController();
const usuarioController = new UsuarioController();

const rotas = Router();

const multerConfig = require("./multer");

rotas.get("/", (req, res) => {
  res.send("<a href='https://front-end-dot-universal-valve-275012.nn.r.appspot.com/'>Ir para a página principal</a>")
});

rotas.post(
  "/oficina/cadastroOficinaCandidata",
  multer(multerConfig).single("logomarca"),
  oficinaController.cadastroDeOficinaCandidata,
);


//marcas 
rotas.post('/marca', multer(multerConfig).single("logomarca"), marcaController.inserirMarca);
rotas.get('/marca', marcaController.listarTodos);
rotas.get('/marca/descricao/', marcaController.listarPorDescricaoParcialEIdOficina);
rotas.get('/marca/id/', marcaController.listarMarcaPorId);
rotas.put('/marca', multer(multerConfig).single("logomarca"), marcaController.alterarMarca);

//modelo
rotas.get('/modelo', modeloController.listarTodos);
rotas.post('/modelo', modeloController.inserirModelo);
rotas.get('/modelo/consulta', modeloController.consultar);
rotas.get('/modelo/id', modeloController.listarModeloPorId);
rotas.put('/modelo', modeloController.alterarModelo);

//peças
rotas.get('/peca', pecaController.listarTodos);
rotas.post('/peca', pecaController.inserirPeca);
rotas.get('/peca/consulta', pecaController.consultar);
rotas.get('/peca/id', pecaController.listarPecaPorId);
rotas.put('/peca', pecaController.alterarPeca);

//clientes
rotas.post("/cliente", clienteController.inserirCliente);
rotas.get('/cliente', clienteController.listarTodos);
rotas.get('/cliente/id', clienteController.listarPorId);
rotas.put('/cliente', clienteController.alterarCliente);

//veiculos
rotas.get('/veiculo', veiculoController.listarTodos);
rotas.post('/veiculo', veiculoController.inserirVeiculo);
rotas.get('/veiculo/id', veiculoController.listarPorId);
rotas.put('/veiculo', veiculoController.alterarVeiculo);

//especialidades
rotas.get('/especialidade', especialidadeController.listarTodos);
rotas.post('/especialidade', especialidadeController.inserirEspecialidade);
rotas.get('/especialidade/id', especialidadeController.listarEspecialidadePorId);
rotas.put('/especialidade', especialidadeController.alterarEspecialidade);

//servicos
rotas.post('/servico', servicoController.inserirServico);


//fornecedores
rotas.post('/fornecedor', fornecedorController.inserirFornecedor)
rotas.get('/fornecedor', fornecedorController.listarTodos)
rotas.get('/fornecedor/id', fornecedorController.listarPorId)
rotas.put('/fornecedor', fornecedorController.alterarFornecedor)



rotas.post("/usuario", usuarioController.incluirDadosDeUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.post("/usuario/loginPorToken", usuarioController.efetuarLoginPorToken);

rotas.post("/usuario/auth", usuarioController.autenticar, usuarioController.teste);



rotas.get('/funcionario', funcionarioController.index);

rotas.post('/funcionario', funcionarioController.salvar);




rotas.put('/funcionario', funcionarioController.editar);



function of(r) {
  return r.status(200).json({ aaa: "ass" });
}

rotas.get('/teste', (req, res, next) => {

  console.log(req.headers.authorization)
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