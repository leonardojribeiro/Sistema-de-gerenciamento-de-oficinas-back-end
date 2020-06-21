const { inserir } = require("./funcionarioServices");

module.exports = {
  validar(fornecedor) {
    const mensagens = [];
    !validacao.validarTexto(fornecedor.nomeFantasia) && mensagens.push("Nome fantasia é obrigatório.");
    !validacao.validarTexto(fornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ é obrigatório.");
    !validacao.validarCpfCnpj(fornecedor.cpfCnpj) && mensagens.push("CPF / CNPJ inválido");
    validacao.validarTexto(fornecedor.telefoneFixo) &&
      !validacao.validarTelefone(fornecedor.telefoneFixo) && mensagens.push("Telefone fixo inválido");
    !validacao.validarTexto(fornecedor.telefoneCelular) && mensagens.push("Telefone celular é obrigatório")
      || !validacao.validarTelefone(fornecedor.telefoneCelular) && mensagens.push("Telefone celular inválido.");
    !validacao.validarTexto(fornecedor.email) &&
      !validacao.validarTexto(fornecedor.email) && !validacao.validarEmail(fornecedor.email) && mensagens.push("E-mail inválido.");
    !validacao.validarTexto(fornecedor.endereco.logradouro) && mensagens.push("Logradouro é obrigatório.");
    !validacao.validarTexto(fornecedor.endereco.numero) && mensagens.push("Número é obrigatório.");
    !validacao.validarTexto(fornecedor.endereco.bairro) && mensagens.push("Endereço é obrigatório.");
    !validacao.validarTexto(fornecedor.endereco.cep) && mensagens.push("CEP é obrigatório.")
      || !validacao.validarCep(fornecedor.endereco.cep) && mensagens.push("CEP inválido.");
    !validacao.validarTexto(fornecedor.endereco.cidade) && mensagens.push("Cidade é obrigatória.");
    !validacao.validarTexto(fornecedor.endereco.estado) && mensagens.push("Estado é obrigatório");
    return mensagens;
  },

  async inserir(fornecedor){
    
  }
}