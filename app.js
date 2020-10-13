const SlackBot = require("slackbots");
const { secretToken } = require("./secretToken");


const bot = new SlackBot({
    token: secretToken,
    name: "apim-helper2"
});
const channelUsers = {};

bot.on("start", () => {
    const userData = bot.getUsers()._value.members;
    userData.forEach((member) => {
        channelUsers[member.id] = {msgCount : 0};
    })

    console.log(channelUsers);
});


bot.on("message", (data) => {
    const {user, channel, type, ts} = data;
    const chanTestSpace = channel === "C01CBCG1Z7F";
    const isUserMessage = user && type === "message";

    // TEST WITH HENRY. COMMENT BACK IN TO SEE IF IT WORKS AFTER USER ADDED

    // if (!(user in channelUsers)) {
    //     channelUsers[user] = {msgCount : 0}
    // }
    
    if (chanTestSpace && isUserMessage){
        console.log(data)
        const chanUser = channelUsers[user];

        if (chanUser && chanUser.msgCount === 0) {
            const confluenceRes = "Hello, thank you for your message. Don't forget to check the API Management Producer support Confluence page at https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone";

            bot.postMessageToChannel('testing-space-for-making-a-slackbot', confluenceRes, {thread_ts: ts});
        }

        channelUsers[user]["msgCount"]++;
    }
});

