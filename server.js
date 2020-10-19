const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);
const token = process.env.SLACK_BOT_TOKEN;
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
    console.log(event)
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

    const result = await bot.client.conversations.history({
      token,
      channel: event.channel,
      limit: 10
    });

    conversationHistory = result.messages;

    console.log(conversationHistory);

    const ephParams = {
        token,
        channel: "platforms-apim-producer-support",
        text: botResponses.generic,
        user: event.user
      };
    const postedResponse = await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(ephParams));

  } catch (event) {console.log(event)}
});

slackEvents.on('app_mention', async (event) => {
    try {
      console.log(event)
      const msgParams = {
        token,
        channel: "platforms-apim-producer-support",
        text: botResponses.generic
      };
      const postedResponse = await axios.post("https://slack.com/api/chat.postMessage", qs.stringify(msgParams));
      console.log(postedResponse);
    } catch (event) {console.log(event)}
  })

slackEvents.on('error', (error) => {
  console.log(error.name);
});

app.listen(port, () => {
  console.log(`listening on ${port}...`);
})