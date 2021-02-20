import { Request, Response, Router } from "express";
import multer from "multer";
import multerConfig from "./multer";
import Auth from "./Midllewares/Auth";
import funcionarioController from './controllers/FuncionarioController';
import usuarioController from "./controllers/UsuarioController";
import modeloController from "./controllers/ModeloController";
import pecaController from "./controllers/PecaController";
import marcaController from "./controllers/MarcaController";
import clienteController from "./controllers/ClienteController";
import servicoController from "./controllers/ServicoController";
import fornecedorController from "./controllers/FornecedorController";
import veiculoController from "./controllers/VeiculoController";
import especialidadeController from './controllers/EspecialidadeController';
import ordemDeServicoController from "./controllers/OrdemDeServicoController";
import validatePagination from "./Midllewares/ValidatePagination";
import oficinaController from "./controllers/OficinaController";

const rotas = Router();

rotas.get("/", (req: Request, res: Response) => {
  res.send("<a href='https://front-end-dot-universal-valve-275012.nn.r.appspot.com/'>Ir para a página principal</a>")
});

// rotas.post(
//   "/oficina/cadastroOficinaCandidata",
//   multer(multerConfig).single("logomarca"),
//   oficinaController.cadastroDeOficinaCandidata,
// );

rotas.get('/oficina', Auth, oficinaController.listarEstatisticas);

rotas.post('/ordemdeservico', Auth, ordemDeServicoController.incluirOrdemDeServico);
rotas.get('/ordemdeservico', Auth, validatePagination, ordemDeServicoController.listarTodas);
rotas.get('/ordemdeservico/id/', Auth, ordemDeServicoController.listarPorId);
rotas.get('/ordemdeservico/consulta', Auth, validatePagination, ordemDeServicoController.consultarOrdemDeServico);
rotas.put('/ordemdeservico', Auth, ordemDeServicoController.alterarOrdemDeServico);
rotas.get('/ordemdeservico/veiculo', Auth, ordemDeServicoController.listarPorVeiculo);

//marcas 
rotas.post('/marca', multer(multerConfig).single("logomarca"), Auth, marcaController.incluirMarca);
rotas.get('/marca', Auth, validatePagination, marcaController.listarTodos);
rotas.get('/marca/consulta/', Auth, validatePagination, marcaController.consultarMarcas);
rotas.get('/marca/id/', Auth, marcaController.listarMarcaPorId);
rotas.put('/marca', multer(multerConfig).single("logomarca"), Auth, marcaController.alterarMarca);

//modelo
rotas.get('/modelo', Auth, validatePagination, modeloController.listarTodos);
rotas.post('/modelo', Auth, modeloController.incluirModelo);
rotas.get('/modelo/consulta', validatePagination, Auth, modeloController.consultarModelos);
rotas.get('/modelo/id', Auth, modeloController.listarModeloPorId);
rotas.put('/modelo', Auth, modeloController.alterarModelo);

// //peças
rotas.get('/peca', Auth, validatePagination, pecaController.listarTodos);
rotas.post('/peca', Auth, pecaController.incluirPeca);
rotas.get('/peca/consulta', Auth, validatePagination, pecaController.consultarPecas);
rotas.get('/peca/id', Auth, pecaController.listarPecaPorId);
rotas.put('/peca', Auth, pecaController.alterarPeca);

// //clientes
rotas.post("/cliente", Auth, clienteController.incluirCliente);
rotas.get('/cliente', Auth, validatePagination, clienteController.listarTodos);
rotas.get('/cliente/consulta', validatePagination, Auth, clienteController.consultarClientes);
rotas.get('/cliente/id', Auth, clienteController.listarPorId);
rotas.put('/cliente', Auth, clienteController.alterarCliente);

// //veiculos
rotas.get('/veiculo', Auth, validatePagination, veiculoController.listarTodos);
rotas.post('/veiculo', Auth, veiculoController.incluirVeiculo);
rotas.get('/veiculo/id', Auth, veiculoController.listarPorId);
rotas.put('/veiculo', Auth, veiculoController.alterarVeiculo);
rotas.get('/veiculo/consulta', Auth, validatePagination, veiculoController.consultarVeiculos)
rotas.get('/veiculo/consultaVinculo', Auth, veiculoController.consultarVinculos);

// //especialidades
rotas.get('/especialidade', Auth, validatePagination, especialidadeController.listarTodos);
rotas.post('/especialidade', Auth, especialidadeController.incluirEspecialidade);
rotas.get('/especialidade/id', Auth, especialidadeController.listarEspecialidadePorId);
rotas.put('/especialidade', Auth, especialidadeController.alterarEspecialidade);
rotas.get('/especialidade/consulta', Auth, validatePagination, especialidadeController.consultarEspecialidades);

//servicos
rotas.post('/servico', Auth, servicoController.incluirServico);
rotas.get('/servico', Auth, validatePagination, servicoController.listarTodos);
rotas.get('/servico/id', Auth, servicoController.listarPorId);
rotas.put('/servico', Auth, servicoController.alterarServico);
rotas.get('/servico/consulta', Auth, validatePagination, servicoController.consultarServicos);
// //fornecedores
rotas.post('/fornecedor', Auth, fornecedorController.incluirFornecedor)
rotas.get('/fornecedor', Auth, validatePagination, fornecedorController.listarTodos)
rotas.get('/fornecedor/consulta', Auth, validatePagination, fornecedorController.consultarFornecedores)
rotas.get('/fornecedor/id', Auth, fornecedorController.listarPorId)
rotas.put('/fornecedor', Auth, fornecedorController.alterarFornecedor)

// //funcionarios
rotas.post('/funcionario', Auth, funcionarioController.incluirFuncionario)
rotas.get('/funcionario', Auth, validatePagination, funcionarioController.listarTodos)
rotas.get('/funcionario/id', Auth, funcionarioController.listarPorId)
rotas.put('/funcionario', Auth, funcionarioController.alterarFuncionario)
rotas.get('/funcionario/consulta', Auth, validatePagination, funcionarioController.consultarFuncionarios);


rotas.post("/usuario", usuarioController.incluirUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.get("/usuario/loginPorToken", Auth, usuarioController.efetuarLoginPorToken);



export default rotas;