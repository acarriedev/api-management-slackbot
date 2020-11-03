const express = require('express');
const axios = require("axios");
const qs = require("qs");
const { createEventAdapter } = require('@slack/events-api');
const { App, LogLevel } = require("@slack/bolt");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const messageLimit = process.env.SLACK_MESSAGE_LIMIT || 10;
const slackEvents = createEventAdapter(slackSigningSecret, {
  includeBody: true,
  includeHeaders: true,
});

const bot = new App({
  token,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG
});
const botResponses = {
    generic: "Hi there and thanks for your message. Can you please confirm that you have already looked for an answer to your question in our <https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone|*API producer zone*> by writing \"I have have already looked for an answer to my question in the API producer zone.\" as a reply to your own question. Thanks."
};

const app = express();

app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
  try {
    const { user, channel, text } = event;
    const isThread = event.thread_ts;
    console.log(`Received a message event: user ${user} in channel ${channel} says ${text}`);
    console.log(event);

    let result;
    let conversationHistory;
    let recentSender;
    if (!isThread) {
      result = await bot.client.conversations.history({
        token,
        channel,
        limit: messageLimit
      });
      conversationHistory = result.messages;
      recentSender = conversationHistory.some((histMessage, index) => {
        return histMessage.user === user && index !== 0;
      });
    };

    console.log("convo history", conversationHistory);
    console.log("Is thread", !recentSender && !isThread);

    if (!recentSender && !isThread) {
      const ephParams = {
        token,
        channel,
        text: botResponses.generic,
        user
      };
      const ephemeralRes = await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(ephParams));
      console.log(ephemeralRes);
    };

  } catch (event) {console.error(event)}
});

slackEvents.on('error', (error) => {
  console.error(error);
});

module.exports = app;
