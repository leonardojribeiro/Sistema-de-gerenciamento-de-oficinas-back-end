require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require("path");
const cors = require('cors');
const Rotas = require('./Rotas');
const app = express();
app.use(morgan('dev'));

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors({}));
app.use(
    "/files",
    express.static(path.resolve(__dirname, "tmp", "uploads"))
  );

app.use(express.json());

app.use(Rotas);

app.listen(process.envPORT || 3333);