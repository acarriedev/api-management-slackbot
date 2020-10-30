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
    generic: "Hi there and thanks for your message. We'll get back to you as soon as we can but you might also find an answer in our <https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone|*API producer zone*>."
};

const app = express();

app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message.groups', async (event) => {
  console.log('MESSAGE.GROUPS')
  try {
    const { user, channel, text } = event;
    console.log(`Received a message event: user ${user} in channel ${channel} says ${text}`);

    console.log(event)

    const result = await bot.client.conversations.history({
      token,
      channel,
      limit: messageLimit
    });

    const conversationHistory = result.messages; 
    
    console.log(conversationHistory)

    const recentSender = conversationHistory.some((histMessage, index) => {
      return histMessage.user === user && index !== 0;
    });

    if (!recentSender) {
      const ephParams = {
        token,
        channel,
        text: botResponses.generic,
        user
      };
      const ephemeralRes = await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(ephParams));
      console.log(ephemeralRes)
    };

  } catch (event) {console.error(event)}
});

// slackEvents.on('message', async (event) => {
//   console.log('MESSAGE')
//   console.log(event)
// })

slackEvents.on('message.channels', async (event) => {
  console.log('MESSAGE.CHANNELS')
  console.log(event)
})

slackEvents.on('message.mpim', async (event) => {
  console.log('MESSAGE.MPIM')
  console.log(event)
})

slackEvents.on('message.*', async (event) => {
  console.log('ALL')
  console.log(event)
})

slackEvents.on('error', (error) => {
  console.error(error.name);
});

module.exports = app;
