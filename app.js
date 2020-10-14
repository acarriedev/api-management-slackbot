const express = require("express");
const app = express();
const cors = require("cors");
const helperBotRouter = require("./routers/helperBot.router");

app.use(cors());
app.use(express.json());

app.use("/helperbot", helperBotRouter);

module.exports = app;
