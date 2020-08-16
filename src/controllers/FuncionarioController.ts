import FuncionarioServices from '../services/FuncionarioServices';
import servicoValidacao from '../services/servicoValidacao';
import { Request, Response } from 'express';
import { IFuncionario } from '../models/Funcionario';
import { IEndereco } from '../models/Endereco';
const funcionarioServices = new FuncionarioServices();

export default class FuncionarioController {
  async inserirFuncionario(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const nome = requisicao.body.nome as string
    const sexo = requisicao.body.sexo as string
    const cpf = requisicao.body.cpf as string
    const dataNascimento = requisicao.body.dataNascimento as Date
    const telefoneFixo = requisicao.body.telefoneFixo as string
    const telefoneCelular = requisicao.body.telefoneCelular as string
    const email = requisicao.body.email as string
    const idsEspecialidades = requisicao.body.idsEspecialidades as string[]
    const endereco = requisicao.body.endereco as IEndereco;
    try {
      const funcionarioASerInserido = {
        nome,
        sexo,
        cpf,
        dataNascimento,
        telefoneFixo,
        telefoneCelular,
        email,
        idsEspecialidades,
        endereco,
        idOficina,
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
    const idOficina = requisicao.body.idOficina as string;
    try {
      const funcionariosListados = await funcionarioServices.listarPorIdOficina(idOficina);
      if (!funcionariosListados) {
        return resposta
          .status(500)
          .json({
            mensagem: "Erro ao listar clientes."
          });
      }
      return resposta.json(funcionariosListados);
    }
    catch (erro) {
      console.log(erro);
      return resposta.status(400).send();
    }
  }

  async listarPorId(requisicao: Request, resposta: Response) {
    const idOficina = requisicao.body.idOficina as string;
    const _id = requisicao.query._id as string;
    try {
      const informacoesDoFuncionario = {
        idOficina,
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

  async alterarFuncionario(requisicao: Request, resposta: Response) {
    const _id = requisicao.body._id as string;
    const nome = requisicao.body.nome as string;
    const sexo = requisicao.body.sexo as string;
    const dataNascimento = requisicao.body.dataNascimento as Date;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const endereco = requisicao.body.endereco as IEndereco;
    const idsEspecialidades = requisicao.body.idsEspecialidades as string[]
    try {
      const funcionarioASerAlterado = {
        _id,
        nome,
        sexo,
        dataNascimento,
        telefoneFixo,
        telefoneCelular,
        email,
        endereco,
        idsEspecialidades,
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
