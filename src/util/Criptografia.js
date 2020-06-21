const crypto = require("crypto");


function criptografar(dado) {
  const cipher = crypto.createCipheriv("aes-256-cbc", process.env.APP_SECRET, process.env.APP_SECRET_IV);
  cipher.update(dado);
  return cipher.final('hex');
}

function descritografar(dado) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", process.env.APP_SECRET, process.env.APP_SECRET_IV);
  decipher.update(dado, "hex");
  return decipher.final().toString();
}

module.exports = {
  descritografar,
  criptografar,
}