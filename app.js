const express = require('express');
const { slackSecret, slackBotToken } = require("./secrets");
const slackSigningSecret = slackSecret || process.env.SLACK_SIGNING_SECRET;
const token = slackBotToken || process.env.SLACK_BOT_TOKEN;
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(slackSigningSecret);
const axios = require("axios");
const qs = require("qs");
const { App, LogLevel } = require("@slack/bolt");

const app = express();

const bot = new App({
  token,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG
});
 
const botResponses = {
    generic: "Hello, thank you for your message. Don't forget to check the API Management Producer support Confluence page at https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone"
};

let conversationHistory;

app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
  try {
    console.log(event);
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

    const result = await bot.client.conversations.history({
      token,
      channel: event.channel,
      limit: 10
    });

    conversationHistory = result.messages;    

    const recentSender = conversationHistory.some((histMessage, index) => {
      return histMessage.user === event.user && index !== 0
    })

    if (!recentSender) {
      const ephParams = {
        token,
        channel: event.channel,
        text: botResponses.generic,
        user: event.user
      };
      await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(ephParams));
    }

  } catch (event) {console.log(event)}
});

slackEvents.on('error', (error) => {
  console.log(error.name);
});

module.exports = { app, bot };
