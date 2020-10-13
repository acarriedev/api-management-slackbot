const SlackBot = require("slackbots");
const { secretToken } = require("./secretToken");


const bot = new SlackBot({
    token: secretToken,
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
    getAndSetChannelUsers()

    console.log(channelUsers);
});


bot.on("message", (data) => {
    const {user, channel, type, ts} = data;
    const chanTestSpace = channel === "C01CBCG1Z7F";
    const isUserMessage = user && type === "message";

    getAndSetChannelUsers()

    // TEST WITH HENRY. COMMENT BACK IN TO SEE IF IT WORKS AFTER USER ADDED

    // if (!(user in channelUsers)) {
    //     channelUsers[user] = {msgCount : 0}
    // }
    
    if (chanTestSpace && isUserMessage){
        console.log(data)
        const {msgCount} = channelUsers[user];

        if (msgCount === 0) {
            bot.postMessageToChannel('testing-space-for-making-a-slackbot', botResponses.generic, {thread_ts: ts});
        }

    }

    if (isUserMessage) channelUsers[user].msgCount++;

    console.log(channelUsers)
});

