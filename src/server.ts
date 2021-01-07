require("dotenv").config();
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from "path";
import cors from 'cors';
import Rotas from './Rotas';
import http from 'http';
import socket, { Server, Socket } from "socket.io";

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

const server = http.createServer(app);

export const io = new Server(server,{cors: {}});

io.on("connection", (socket: Socket) => {
  //socket.
  console.log(socket.handshake.query)
  ///io.emit("novoServico", {descricao: "teste socket", _id: "123", tempoDuracao: 50, })
});


app.use((requisicao, resposta) => {
  return resposta 
    .status(404)
    .send(
      { mensagem: "Recurso não encontrado." }
    )
})

server.listen(process.env.PORT || 3333);
//app.listen(process.env.PORT || 3333);