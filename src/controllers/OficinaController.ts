import { IEndereco } from './../models/Endereco';
import { IOficina } from './../models/Oficina';
import { Request, Response } from "express";
import ordemDeServicoServices from "../services/OrdemDeServicoServices";
import oficinaServices from "../services/oficinaServices";

export default {
  async cadastroDeOficinaCandidata(requisicao: Request, resposta: Response) {
    const nomeFantasia = requisicao.body.nomeFantasia as string;
    const razaoSocial = requisicao.body.razaoSocial as string;
    const cpfCnpj = requisicao.body.cpfCnpj as string;
    const telefoneFixo = requisicao.body.telefoneFixo as string;
    const telefoneCelular = requisicao.body.telefoneCelular as string;
    const email = requisicao.body.email as string;
    const webSite = requisicao.body.website as string;
    const endereco = JSON.parse(requisicao.body.endereco) as IEndereco;
    const latitude = requisicao.body.latitude as string;
    const longitude = requisicao.body.longitude as string;

    const uriLogo = requisicao.file;

    const oficina = {
      nomeFantasia,
      razaoSocial,
      cpfCnpj,
      telefoneFixo,
      telefoneCelular,
      email,
      endereco,
      localizacao: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      uriLogo: '',
      webSite,
      statusOficina: "Candidata"
    } as IOficina
    //valida os dados recebidos
    const mensagens = oficinaServices.validar(oficina);
    if (mensagens.length) {
      //oficinaServices.apagarLogomarca(uriLogo);
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }
    //verifica se existe uma oficina com o mesmo cpf ou cnpj
    const oficinaComMesmoCpfCnpj = await oficinaServices.listarPorCpfCnpj(cpfCnpj);
    //verifica se existe uma oficina com o mesmo e-mail
    const oficinaComMesmoEmail = await oficinaServices.listarPorEmail(email);
    if (oficinaComMesmoCpfCnpj) {
      //oficinaServices.apagarLogomarca(uriLogo);//apaga a logomarca
      return resposta.status(406)
        .json({
          mensagem: "O CPF/CNPJ informado já se encontra cadastrado."
        });
    }
    if (oficinaComMesmoEmail) {
      // oficinaServices.apagarLogomarca(uriLogo);//apaga a logomarca
      return resposta.status(406)
        .json({
          mensagem: "O E-mail informado já se encontra cadastrado."
        });
    }
    const oficinaInserida = await oficinaServices.inserir(oficina);
    if (!oficinaInserida) {
      //oficinaServices.apagarLogomarca(uriLogo);
      return resposta.status(500)
        .json({
          mensagem: "Oficina candidata não cadastrada."
        });
    }
    return resposta.status(201)
      .json({
        mensagem: "Oficina candidata cadastrada com sucesso."
      });
  },

  async listarEstatisticas(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina;
    const agoraMenosUmMes = new Date((Date.now() - (24 * 60 * 60 * 1000 * 1200)));
    agoraMenosUmMes.setUTCHours(0);
    agoraMenosUmMes.setUTCMinutes(0);
    agoraMenosUmMes.setUTCSeconds(0);
    agoraMenosUmMes.setUTCMilliseconds(0);
    const totalOrdensDeServico = await ordemDeServicoServices.consultar(oficina, { dataDeRegistro: agoraMenosUmMes }, 1, 1000);
    const totalOrdensDeServicoEmAndamento = await ordemDeServicoServices.contarEmAndamentoPorOficina(oficina);
    return resposta.json({
      totalOrdensDeServico,
      totalOrdensDeServicoEmAndamento
    })
  }
}