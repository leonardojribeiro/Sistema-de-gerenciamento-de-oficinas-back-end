import mongoose from "mongoose";

function validaCpf(cpf: string) {
  let soma = 0;
  let peso = 10;
  let resto;
  let dv1;
  let dv2;
  if (!cpf || cpf.length !== 11
    || cpf === "00000000000"
    || cpf === "11111111111"
    || cpf === "22222222222"
    || cpf === "33333333333"
    || cpf === "44444444444"
    || cpf === "55555555555"
    || cpf === "66666666666"
    || cpf === "77777777777"
    || cpf === "88888888888"
    || cpf === "99999999999") {
    return false;
  }
  //valida o primeiro dígito
  for (let i = 0; i < 9; i++) {
    soma += (parseInt(cpf.charAt(i)) * peso);
    peso--;
  }
  resto = 11 - (soma % 11);
  dv1 = (resto === 10 || resto === 10) ? 0 : resto;
  //valida o segundo digito
  soma = 0;
  peso = 11;
  for (let i = 0; i < 10; i++) {
    soma += (parseInt(cpf.charAt(i)) * peso);
    peso--;
  }
  resto = 11 - (soma % 11);
  dv2 = (resto === 10 || resto === 11) ? 0 : resto;
  return (dv1 === parseInt(cpf.charAt(9)) && dv2 === parseInt(cpf.charAt(10)));
}

function validaCnpj(cnpj: string) {
  let soma = 0;
  let peso = 5;
  let resto;
  let dv1;
  let dv2;
  if (!cnpj || cnpj.length !== 14
    || cnpj === "00000000000000"
    || cnpj === "11111111111111"
    || cnpj === "22222222222222"
    || cnpj === "33333333333333"
    || cnpj === "44444444444444"
    || cnpj === "55555555555555"
    || cnpj === "66666666666666"
    || cnpj === "77777777777777"
    || cnpj === "88888888888888"
    || cnpj === "99999999999999") {
    return false;
  }
  for (let i = 0; i < 12; i++) {
    soma += (parseInt(cnpj.charAt(i)) * peso);
    peso--;
    if (peso < 2) {
      peso = 9;
    }
  }
  resto = (soma % 11)
  dv1 = (resto < 2) ? 0 : 11 - resto;
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += (parseInt(cnpj.charAt(i)) * peso);
    peso--;
    if (peso < 2) {
      peso = 9;
    }
  }
  resto = (soma % 11)
  dv2 = (resto < 2) ? 0 : 11 - resto;
  return (dv1 === parseInt(cnpj.charAt(12)) && dv2 === parseInt(cnpj.charAt(13)));
}

function validarCpfCnpj(cpfCnpj: string) {
  if (!cpfCnpj) {
    return false;
  }
  cpfCnpj = cpfCnpj.replace(/[^\d]+/g, "");
  if (cpfCnpj.length === 11) {
    return validaCpf(cpfCnpj);
  }
  if (cpfCnpj.length === 14) {
    return validaCnpj(cpfCnpj);
  }
  return false;
};


function validarNome(nome: string) {
  return nome && nome.length > 2;
}

function validarEmail(email: string) {
  if (!email) {
    return false;
  }
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email);
}

function validarTelefone(telefone: string) {
  if (!telefone) {
    return false;
  }
  telefone = telefone.replace(/[^\d]+/g, "");
  return telefone.length === 10 || telefone.length === 11
}

function validarTexto(texto: string) {
  return texto && texto.length > 0;
}

function validarCep(cep: string) {
  if (!cep) {
    return false;
  }
  cep = cep.replace(/[^\d]+/g, "");
  return cep.length === 8;
}

function validarNumero(numero: number) {
  return numero && numero != null;
}

function validarSenha(senha: string) {
  return senha && senha.length >= 6;
}

function validarPlaca(placa: string) {
  placa = placa.replace(/[^a-zA-Z0-9]/g, "");
  console.log(placa)
  return placa && placa.length === 7;
}

function validarData(data: Date) {
  return !!new Date(data);
}

function validarId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validarPaginacao(pagina: number, limite: number) {
  return (pagina && limite && pagina >= 1 && limite >= 1);
}

export default {
  validarCpfCnpj,
  validarNome,
  validarEmail,
  validarTelefone,
  validarTexto,
  validarCep,
  validarNumero,
  validarSenha,
  validarPlaca,
  validarId,
  validarData,
  validarPaginacao,
}