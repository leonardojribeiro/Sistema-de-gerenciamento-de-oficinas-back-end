import { Storage } from "@google-cloud/storage";

const storage = Boolean(process.env.DESENVOLVIMENTO)
  ? new Storage({
    projectId: process.env.GCLOUD_STORAGE_PROJECT_ID as string,
    keyFilename: process.env.GCLOUD_STORAGE_KEY_FILE_NAME as string,
  })
  : new Storage({
    projectId: process.env.GCLOUD_STORAGE_PROJECT_ID as string,
  })

const bucket = process.env.GCLOUD_STORAGE_BUCKET
? storage.bucket(process.env.GCLOUD_STORAGE_BUCKET as string)
: null;

export default {
  async salvar(nome: string, buffer: Buffer) {
    if(bucket){
      const arquivo = bucket.file(nome);
      return await arquivo
        .save(buffer);
    }
  },
  async apagar(nome: string) {
    if (bucket && nome) {
      const arquivo = bucket.file(nome);
      return await arquivo.delete();
    }
    return null;
  }
}