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
const Auth = require("./Midllewares/Auth");

rotas.get("/", (req, res) => {
  res.send("<a href='https://front-end-dot-universal-valve-275012.nn.r.appspot.com/'>Ir para a página principal</a>")
});

rotas.post(
  "/oficina/cadastroOficinaCandidata",
  multer(multerConfig).single("logomarca"),
  oficinaController.cadastroDeOficinaCandidata,
);


//marcas 
rotas.post('/marca', Auth.autenticar, multer(multerConfig).single("logomarca"), marcaController.inserirMarca);
rotas.get('/marca', Auth.autenticar, marcaController.listarTodos);
rotas.get('/marca/descricao/', Auth.autenticar, marcaController.listarPorDescricaoParcialEIdOficina);
rotas.get('/marca/id/', Auth.autenticar, marcaController.listarMarcaPorId);
rotas.put('/marca', Auth.autenticar, multer(multerConfig).single("logomarca"), marcaController.alterarMarca);

//modelo
rotas.get('/modelo', Auth.autenticar, modeloController.listarTodos);
rotas.post('/modelo', Auth.autenticar, modeloController.inserirModelo);
rotas.get('/modelo/consulta', Auth.autenticar, modeloController.consultar);
rotas.get('/modelo/id', Auth.autenticar, modeloController.listarModeloPorId);
rotas.put('/modelo', Auth.autenticar, modeloController.alterarModelo);

//peças
rotas.get('/peca', Auth.autenticar,  pecaController.listarTodos);
rotas.post('/peca', Auth.autenticar,  pecaController.inserirPeca);
rotas.get('/peca/consulta', Auth.autenticar,  pecaController.consultar);
rotas.get('/peca/id', Auth.autenticar,  pecaController.listarPecaPorId);
rotas.put('/peca', Auth.autenticar,  pecaController.alterarPeca);

//clientes
rotas.post("/cliente", Auth.autenticar,  clienteController.inserirCliente);
rotas.get('/cliente', Auth.autenticar,  clienteController.listarTodos);
rotas.get('/cliente/id', Auth.autenticar,  clienteController.listarPorId);
rotas.put('/cliente', Auth.autenticar,  clienteController.alterarCliente);

//veiculos
rotas.get('/veiculo', Auth.autenticar,  veiculoController.listarTodos);
rotas.post('/veiculo', Auth.autenticar,  veiculoController.inserirVeiculo);
rotas.get('/veiculo/id', Auth.autenticar,  veiculoController.listarPorId);
rotas.put('/veiculo', Auth.autenticar,  veiculoController.alterarVeiculo);

//especialidades
rotas.get('/especialidade', Auth.autenticar,  especialidadeController.listarTodos);
rotas.post('/especialidade', Auth.autenticar,  especialidadeController.inserirEspecialidade);
rotas.get('/especialidade/id', Auth.autenticar,  especialidadeController.listarEspecialidadePorId);
rotas.put('/especialidade', Auth.autenticar,  especialidadeController.alterarEspecialidade);

//servicos
rotas.post('/servico', Auth.autenticar,  servicoController.inserirServico);


//fornecedores
rotas.post('/fornecedor', Auth.autenticar,  fornecedorController.inserirFornecedor)
rotas.get('/fornecedor', Auth.autenticar,  fornecedorController.listarTodos)
rotas.get('/fornecedor/id', Auth.autenticar,  fornecedorController.listarPorId)
rotas.put('/fornecedor', Auth.autenticar,  fornecedorController.alterarFornecedor)

//funcionarios
rotas.post('/funcionario', Auth.autenticar,  funcionarioController.inserirFuncionario)
rotas.get('/funcionario', Auth.autenticar,  funcionarioController.listarTodos)
rotas.get('/funcionario/id', Auth.autenticar,  funcionarioController.listarPorId)
rotas.put('/funcionario', Auth.autenticar,  funcionarioController.alterarFuncionario)


rotas.post("/usuario", usuarioController.incluirDadosDeUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.post("/usuario/loginPorToken", usuarioController.efetuarLoginPorToken);

rotas.post("/usuario/auth", usuarioController.autenticar, usuarioController.teste);



module.exports = rotas;