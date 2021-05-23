const Discord = require('discord.js');
const client = new Discord.Client();
const GameManager = require('./manager.js');
const Logger = require('./nodelog.js');

var log = null;
if (process.env.LOGFILE) {
    log = new Logger(process.env.LOGFILE);
}
let gameManager = new GameManager(log);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (log) {
        log.log_message(msg.channel,msg.author,msg.content);
    }
    if (msg.author.id === client.user.id || msg.channel.type === "dm") {
        return;
    }
    gameManager.msgHandler(msg, client.user.id);
});
client.on('voiceStateUpdate', (oldState,newState) => {
    //console.log(oldState, newState)
    let locName = newState.channel && newState.channel.name;
    let pc = gameManager.findCharacterFromUser(newState.member);
    let loc = gameManager.findbyVoice(locName);
    if (pc != undefined && loc != undefined && pc.location !== loc) {
        pc.move(null,loc);
    }
});


client.login(process.env.BOT_SECRET_ID);
