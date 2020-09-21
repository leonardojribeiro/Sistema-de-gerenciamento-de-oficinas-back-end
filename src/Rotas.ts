import { Request, Response,Router } from "express";
import multer from "multer";
import multerConfig from "./multer";
import Auth from "./Midllewares/Auth";
import FuncionarioController from './controllers/FuncionarioController';
import UsuarioController from "./controllers/UsuarioController";
import ModeloController from "./controllers/ModeloController";
import PecaController from "./controllers/PecaController";
import MarcaController from "./controllers/MarcaController";
import ClienteController from "./controllers/ClienteController";
import ServicoController from "./controllers/ServicoController";
import FornecedorContoller from "./controllers/FornecedorController";
import VeiculoController from "./controllers/VeiculoController";
import EspecialidadeController from './controllers/EspecialidadeController';
import OrdemDeServicoContoller from "./controllers/OrdemDeServicoController";
import validatePagination from "./Midllewares/ValidatePagination";

const modeloController = new ModeloController();
const pecaController = new PecaController();
const marcaController = new MarcaController();
const clienteController = new ClienteController();
const servicoController = new ServicoController();
const fornecedorController = new FornecedorContoller();
const veiculoController = new VeiculoController();
const usuarioController = new UsuarioController();
const funcionarioController = new FuncionarioController();
const especialidadeController = new EspecialidadeController();
const ordemDeServicoController = new OrdemDeServicoContoller();
//const OficinaController = new OficinaController();
const rotas = Router();

rotas.get("/", (req: Request, res: Response) => {
  res.send("<a href='https://front-end-dot-universal-valve-275012.nn.r.appspot.com/'>Ir para a página principal</a>")
});

// rotas.post(
//   "/oficina/cadastroOficinaCandidata",
//   multer(multerConfig).single("logomarca"),
//   oficinaController.cadastroDeOficinaCandidata,
// );
rotas.post('/ordemdeservico', Auth, ordemDeServicoController.incluirOrdemDeServico);
rotas.get('/ordemdeservico', Auth, ordemDeServicoController.listarTodas);

//marcas 
rotas.post('/marca',  multer(multerConfig).single("logomarca"), Auth, marcaController.inserirMarca);
rotas.get('/marca', Auth, marcaController.listarTodos);
rotas.get('/marca/consulta/', Auth, marcaController.consultar);
rotas.get('/marca/id/', Auth, marcaController.listarMarcaPorId);
rotas.put('/marca',  multer(multerConfig).single("logomarca"), Auth, marcaController.alterarMarca);

//modelo
rotas.get('/modelo', Auth, modeloController.listarTodos);
rotas.post('/modelo', Auth, modeloController.inserirModelo);
rotas.get('/modelo/consulta', Auth, modeloController.consultar);
rotas.get('/modelo/id', Auth, modeloController.listarModeloPorId);
rotas.put('/modelo', Auth, modeloController.alterarModelo);

// //peças
rotas.get('/peca', Auth,  pecaController.listarTodos);
rotas.post('/peca', Auth,  pecaController.inserirPeca);
rotas.get('/peca/consulta', Auth,  pecaController.consultar);
rotas.get('/peca/id', Auth,  pecaController.listarPecaPorId);
rotas.put('/peca', Auth,  pecaController.alterarPeca);

// //clientes
rotas.post("/cliente", Auth,  clienteController.inserirCliente);
rotas.get('/cliente', Auth,  clienteController.listarTodos);
rotas.get('/cliente/consulta', Auth,  clienteController.consultar);
rotas.get('/cliente/id', Auth,  clienteController.listarPorId);
rotas.put('/cliente', Auth,  clienteController.alterarCliente);

// //veiculos
rotas.get('/veiculo', Auth,  veiculoController.listarTodos);
rotas.post('/veiculo', Auth,  veiculoController.inserirVeiculo);
rotas.get('/veiculo/id', Auth,  veiculoController.listarPorId);
rotas.put('/veiculo', Auth,  veiculoController.alterarVeiculo);

// //especialidades
rotas.get('/especialidade', Auth,  especialidadeController.listarTodos);
rotas.post('/especialidade', Auth,  especialidadeController.inserirEspecialidade);
rotas.get('/especialidade/id', Auth,  especialidadeController.listarEspecialidadePorId);
rotas.put('/especialidade', Auth,  especialidadeController.alterarEspecialidade);
rotas.get('/especialidade/consulta', Auth,  especialidadeController.consultar);

//servicos
rotas.post('/servico', Auth,  servicoController.inserirServico);
rotas.get('/servico', Auth, validatePagination, servicoController.listarTodos);
rotas.get('/servico/id', Auth,  servicoController.listarPorId);
rotas.put('/servico', Auth,  servicoController.alterarServico);
rotas.get('/servico/consulta', Auth, validatePagination, servicoController.consultar);
// //fornecedores
rotas.post('/fornecedor', Auth,  fornecedorController.inserirFornecedor)
rotas.get('/fornecedor', Auth,  fornecedorController.listarTodos)
rotas.get('/fornecedor/id', Auth,  fornecedorController.listarPorId)
rotas.put('/fornecedor', Auth,  fornecedorController.alterarFornecedor)

// //funcionarios
rotas.post('/funcionario', Auth,  funcionarioController.inserirFuncionario)
rotas.get('/funcionario', Auth,  funcionarioController.listarTodos)
rotas.get('/funcionario/id', Auth,  funcionarioController.listarPorId)
rotas.put('/funcionario', Auth,  funcionarioController.alterarFuncionario)
rotas.get('/funcionario/consulta', Auth,  funcionarioController.consultar);


// rotas.post("/usuario", usuarioController.incluirDadosDeUsuario);

rotas.post("/usuario/login", usuarioController.efetuarLogin);

rotas.get("/usuario/loginPorToken", Auth, usuarioController.efetuarLoginPorToken);



export default rotas;