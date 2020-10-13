const SlackBot = require('slackbots');
const { secretToken } = require("./secretToken")
 
// create a bot
const bot = new SlackBot({
    token: secretToken, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'apim-helper2'
});

const channelUsers = {}

 
bot.on('start', function() {

    const userData = bot.getUsers()._value.members
    userData.forEach((member) => {
        channelUsers[member.id] = {msgCount : 0}
    })

    // more information about additional params https://api.slack.com/methods/chat.postMessage
    // const params = {
    //     icon_emoji: ':cat:'
    // };
    
    // // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    // bot.postMessageToChannel('general', 'meow!', params);
    
    // // define existing username instead of 'user_name'
    // bot.postMessageToUser('alexander.carrie1', 'meow!', params); 
    
    // // If you add a 'slackbot' property, 
    // // you will post to another user's slackbot channel instead of a direct message
    // bot.postMessageToUser('user_name', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' }); 
    
    // // define private group instead of 'private_group', where bot exist
    // bot.postMessageToGroup('private_group', 'meow!', params); 
});

/**
 * @param {object} data 
 */
bot.on('message', function(data) {
    const {user, channel, type, ts} = data
    
    if (channel === "C01CBCG1Z7F" && type === "message"){
        console.log(data)
        if (channelUsers[user]["msgCount"] == 0) {
            const confluenceRes = "Hello, thank you for your message. Don't forget to check the API Management Producer support Confluence page at https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone"
            bot.postMessageToChannel('testing-space-for-making-a-slackbot', confluenceRes, {thread_ts: ts});
        }

        channelUsers[user]["msgCount"]++
    }
});

// bot.postMessageToUser('alexander.carrie1', 'howdy').then(function(data) {
//     console.log(data)
// })
