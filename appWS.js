const SlackBot = require("slackbots");
const { SECRET_TOKEN } = process.env;


const bot = new SlackBot({
    token: SECRET_TOKEN,
    name: "apim-helper2"
});

const botResponses = {
    generic: "Hello, thank you for your message. Don't forget to check the API Management Producer support Confluence page at https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone"
}

const channelUsers = {};

const getAndSetChannelUsers = () => {
    const userData = bot.getUsers();
    const members = userData._value.members;
    members.forEach((member) => {
        if (!channelUsers[member.id]) channelUsers[member.id] = {msgCount : 0};
    })
}

bot.on("start", () => {
    getAndSetChannelUsers();
    console.log(channelUsers);
});


bot.on("message", (data) => {
    const {user, channel, type, ts} = data;
    const isUserMessage = user && type === "message";

    getAndSetChannelUsers();
    
    if (isUserMessage){
        const {msgCount} = channelUsers[user];

        if (msgCount === 0) {
            bot.postMessage(channel, botResponses.generic, {thread_ts: ts});
        }
        
        channelUsers[user].msgCount++;
    }
});
