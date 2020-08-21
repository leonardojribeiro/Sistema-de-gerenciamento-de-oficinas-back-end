require("dotenv").config();
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from "path";
import cors from 'cors';
import Rotas from './Rotas';
const app = express();
app.use(morgan('dev'));

mongoose.set('useCreateIndex', true);

mongoose.connect(
  process.env.MONGO_URL as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(cors({}));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "tmp", "uploads"))
);

app.use(express.json());

app.use(Rotas);

app.use((requisicao, resposta) => {
  return resposta
    .status(404)
    .send(
      { mensagem: "Recurso não encontrado." }
    )
})

app.listen(process.env.PORT || 3333);