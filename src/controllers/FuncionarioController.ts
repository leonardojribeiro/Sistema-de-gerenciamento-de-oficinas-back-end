import FuncionarioServices from '../services/FuncionarioServices';
import servicoValidacao from '../services/servicoValidacao';
import { Request, Response } from 'express';
import { IFuncionario } from '../models/Funcionario';
import { IEndereco } from '../models/Endereco';
import validacao from '../util/validacao';
import { replaceNoNumeric } from '../util/Replace';
const funcionarioServices = new FuncionarioServices();

export default class FuncionarioController {
  async inserirFuncionario(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const nome = requisicao.body.nome as string
    const sexo = requisicao.body.sexo as string
    const cpf = requisicao.body.cpf as string
    const dataNascimento = requisicao.body.dataNascimento as Date
    const telefoneFixo = requisicao.body.telefoneFixo as string
    const telefoneCelular = requisicao.body.telefoneCelular as string
    const email = requisicao.body.email as string
    const especialidades = requisicao.body.especialidades as string[]
    const endereco = requisicao.body.endereco as IEndereco;
    try {
      const funcionarioASerInserido = {
        nome,
        sexo,
        cpf: replaceNoNumeric(cpf),
        dataNascimento,
        telefoneFixo: replaceNoNumeric(telefoneFixo),
        telefoneCelular: replaceNoNumeric(telefoneCelular),
        email,
        especialidades,
        endereco,
        oficina,
      } as IFuncionario;
      const mensagens = funcionarioServices.validarFuncionarioASerInserido(funcionarioASerInserido);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const funcionarioExistenteNaOficina = await funcionarioServices.contarFuncionariosPorCpfEIdOficina(funcionarioASerInserido);
      console.log(funcionarioExistenteNaOficina)
      if (funcionarioExistenteNaOficina) {
        return resposta.status(406)
          .json({
            mensagem: "Funcionário já cadastrado."
          });
      }
      const clienteInserido = await funcionarioServices.inserirFuncionario(funcionarioASerInserido);
      if (!clienteInserido) {
        return resposta.status(500)
          .json({
            mensagem: "Funcionário não cadastrado."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Funcionário cadastrado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarTodos(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pagina = Number(requisicao.query.pagina);
    const limite = Number(requisicao.query.limite);
    try {
      if (!validacao.validarPaginacao(pagina, limite)) {
        return resposta.status(400).send();
      }
      const pular = (pagina - 1) * limite;
      const funcionarios = await funcionarioServices.listarPorOficina(oficina, pular, limite);
      const total = await funcionarioServices.contarPorOficina(oficina);
      if (!funcionarios) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar funcionarios."
          });
      }
      return resposta.json({
        funcionarios,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoFuncionario = {
        oficina,
        _id
      } as IFuncionario;
      const mensagens = servicoValidacao.validarIdDoFuncionario(_id);
      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const funcionarioListado = await funcionarioServices.listarPorIdFuncionarioEIdOficina(informacoesDoFuncionario);
      if (!funcionarioListado) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar funcionário."
          });
      }
      return resposta.json(funcionarioListado[0]);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async consultar(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina as string;
    const pagina = Number(requisicao.query.pagina);
    const limite = Number(requisicao.query.limite);
    const nome = requisicao.query.nome as string;
    let cpf = requisicao.query.cpf as string | undefined;
    const email = requisicao.query.email as string;
    let telefone = requisicao.query.telefone as string | undefined;
    try {
      if (!validacao.validarPaginacao(pagina, limite)) {
        return resposta.status(400).send();
      }
      const pular = (pagina - 1) * limite;
      cpf = replaceNoNumeric(cpf);
      telefone = replaceNoNumeric(telefone);
      const funcionarios = await funcionarioServices.consultar(oficina, nome, cpf, email, telefone, pular, limite);
      const total = await funcionarioServices.contarPorConsulta(oficina, nome, cpf, email, telefone); 
      if (!funcionarios) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar funcionarios."
          });
      }
      return resposta.json({
        funcionarios,
        total
      })
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async alterarFuncionario(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const nome = requisicao.body.nome as string;
    const sexo = requisicao.body.sexo as string;
    const dataNascimento = requisicao.body.dataNascimento as Date;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    const especialidades = requisicao.body.especialidades as string[]
    try {
      const funcionarioASerAlterado = {
        _id,
        nome,
        sexo,
        dataNascimento,
        telefoneFixo: replaceNoNumeric(telefoneFixo),
        telefoneCelular: replaceNoNumeric(telefoneCelular),
        email,
        endereco,
        especialidades,
      } as IFuncionario;
      const mensagens = funcionarioServices.validarClienteASerAlterado(funcionarioASerAlterado);

      if (mensagens.length) {
        return resposta.status(406)
          .json({
            mensagem: mensagens
          });
      }
      const result = await funcionarioServices.alterarFuncionario(funcionarioASerAlterado);
      if (!result.nModified) {
        return resposta.status(500)
          .json({
            mensagem: "Funcionário não alterado."
          });
      }
      return resposta.status(201)
        .json({
          mensagem: "Funcionário alterado com sucesso."
        });
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

}
