const { createServer } = require('http');
const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);
 
const app = express();
 
app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

slackEvents.on('app_mention', async (event) => {
      try {
        console.log("I got a mention in this channel", event.channel)
      } catch (e) {console.log(e)}
    })

slackEvents.on('error', (error) => {
  console.log(error.name); // TypeError
});
 
// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
app.listen(port, () => {
  console.log(`listening on ${port}...`)
})