import { Storage } from "@google-cloud/storage";

const storage = process.env.DESENVOLVIMENTO
  ? new Storage({
    projectId: "universal-valve-275012",
    keyFilename: "D:/Downloads/universal-valve-275012-2220cb9ae931.json"
  })
  : new Storage({
    projectId: "universal-valve-275012",
  })

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET as string);

export default {
  async salvar(nome: string, buffer: Buffer) {
    const arquivo = bucket.file(nome);
    return await arquivo
      .save(buffer);
  },
  async apagar(nome: string) {
    if (nome) {
      const arquivo = bucket.file(nome);
      return await arquivo.delete();
    }
    return null;
  }
}