const helperBotRouter = require("express").Router();
const { getInitialResponse } = require("../controllers/helperBot.controllers");

helperBotRouter.route("/").get(getInitialResponse);

module.exports = helperBotRouter;