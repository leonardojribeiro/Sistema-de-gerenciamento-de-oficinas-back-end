import crypto from "crypto";


function criptografar(dado: string) {
  const cipher = crypto.createCipheriv("aes-256-cbc", process.env.APP_SECRET as string, process.env.APP_SECRET_IV as string);
  cipher.update(dado);
  return cipher.final('hex');
}

function descritografar(dado: string) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", process.env.APP_SECRET as string, process.env.APP_SECRET_IV as string);
  decipher.update(dado, "hex");
  return decipher.final().toString();
}

export default {
  descritografar,
  criptografar,
}