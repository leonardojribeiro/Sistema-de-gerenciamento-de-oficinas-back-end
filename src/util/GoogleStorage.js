const { Storage } = require("@google-cloud/storage");

const storage =
  new Storage({
    projectId: "universal-valve-275012",
    keyFilename: "D:/Downloads/universal-valve-275012-2220cb9ae931.json"
  })
  ;

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

module.exports = {

  async salvar(nome, buffer) {
    const arquivo = bucket.file(nome);
    return await arquivo
      .save(buffer)
      .catch(e => {
        console.log(e)
      });
  },

  async apagar(nome) {
    if (nome) {
      const arquivo = bucket.file(nome);
      return await arquivo.delete().catch(e => console.log(e));
    }
    return null;
  }

}