import { Request, Response } from "express";
import OrdemDeServicoServices from "../services/OrdemDeServicoServices";
const oficinaServicos = require("../services/oficinaServices");
const ordemDeServicoServices = new OrdemDeServicoServices()

export default class OficinaController {
  async cadastroDeOficinaCandidata(requisicao: Request, resposta: Response) {
    const {
      nomeFantasia,
      razaoSocial,
      cpfCnpj,
      telefoneFixo,
      telefoneCelular,
      email,
      website,
      logradouro,
      numero,
      bairro,
      cep,
      complemento,
      cidade,
      estado,
      latitude,
      longitude,
    } = requisicao.body;

    //const uriLogo = requisicao.file;

    const oficina = {
      nomeFantasia,
      razaoSocial,
      cpfCnpj,
      telefoneFixo,
      telefoneCelular,
      email,
      website,
      //uriLogo,
      endereco: {
        logradouro,
        numero,
        bairro,
        cep,
        complemento,
        cidade,
        estado,
      },
      localizacao: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      statusOficina: "Candidata"
    }

    //valida os dados recebidos
    const mensagens = oficinaServicos.validar(oficina);

    if (mensagens.length) {
      //oficinaServicos.apagarLogomarca(uriLogo);
      return resposta.status(406)
        .json({
          mensagem: mensagens
        });
    }

    //verifica se existe uma oficina com o mesmo cpf ou cnpj
    const oficinaComMesmoCpfCnpj = await oficinaServicos.listarPorCpfCnpj(cpfCnpj);
    //verifica se existe uma oficina com o mesmo e-mail
    const oficinaComMesmoEmail = await oficinaServicos.listarPorEmail(email);

    if (oficinaComMesmoCpfCnpj) {
      //oficinaServicos.apagarLogomarca(uriLogo);//apaga a logomarca
      return resposta.status(406)
        .json({
          mensagem: "O CPF/CNPJ informado já se encontra cadastrado."
        });
    }

    if (oficinaComMesmoEmail) {
      // oficinaServicos.apagarLogomarca(uriLogo);//apaga a logomarca
      return resposta.status(406)
        .json({
          mensagem: "O E-mail informado já se encontra cadastrado."
        });
    }

    const oficinaInserida = await oficinaServicos.inserir(oficina);

    if (!oficinaInserida) {
      //oficinaServicos.apagarLogomarca(uriLogo);
      return resposta.status(500)
        .json({
          mensagem: "Oficina candidata não cadastrada."
        });
    }

    return resposta.status(201)
      .json({
        mensagem: "Oficina candidata cadastrada com sucesso."
      });
  }

  async listarEstatisticas(requisicao: Request, resposta: Response) {
    const oficina = requisicao.body.oficina;
    const agoraMenosUmMes = new Date((Date.now() - (24 * 60 * 60 * 1000 * 1200)));
    agoraMenosUmMes.setUTCHours(0);
    agoraMenosUmMes.setUTCMinutes(0);
    agoraMenosUmMes.setUTCSeconds(0);
    agoraMenosUmMes.setUTCMilliseconds(0);
    console.log(agoraMenosUmMes)

    const totalOrdensDeServico = await ordemDeServicoServices.consultar(oficina, { dataDeRegistro: agoraMenosUmMes }, 1, 1000);
    const totalOrdensDeServicoEmAndamento = await ordemDeServicoServices.contarEmAndamentoPorOficina(oficina);
    return resposta.json({
      totalOrdensDeServico,
      totalOrdensDeServicoEmAndamento
    })
  }
}