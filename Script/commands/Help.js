const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner : 𝐉𝐔𝐁𝐀𝐘𝐄𝐓 𝐁𝐀𝐁𝐘
╰━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
        "user": "User",
        "adminGroup": "Admin Group",
        "adminBot": "Admin Bot"
    }
};

// 🔹 এখানে আপনার ফটো Imgur লিংক করে বসাবেন ✅
const helpImages = [
    "https://i.postimg.cc/13HQnwnj/1665071460141.jpg",
    "https://i.postimg.cc/Nj3V5W7Q/1743425354615.jpg",
    "https://i.postimg.cc/g2xFwVCD/1743602122535.jpg",
    "https://i.postimg.cc/HnNzFy6k/1742374958915-2.jpg"
];


function downloadImages(callback) {
    const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
    const filePath = path.join(__dirname, "cache", "help_random.jpg");

    request(randomUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => callback([filePath]));
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || body.indexOf("help") != 0) return;  
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);  
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;  

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const command = commands.get(splitBody[1].toLowerCase());  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    const detail = getText("moduleInfo",  
        command.config.name,  
        command.config.usages || "Not Provided",  
        command.config.description || "Not Provided",  
        command.config.hasPermssion,  
        command.config.credits || "Unknown",  
        command.config.commandCategory || "Unknown",  
        command.config.cooldowns || 0,  
        prefix,  
        global.config.BOTNAME || "𝐉𝐮𝐛𝐚𝐲𝐞 𝐗 𝐁𝐨𝐭"  
    );  

    downloadImages(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: detail, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  

        const detailText = getText("moduleInfo",  
            command.config.name,  
            command.config.usages || "Not Provided",  
            command.config.description || "Not Provided",  
            command.config.hasPermssion,  
            command.config.credits || "Unknown",  
            command.config.commandCategory || "Unknown",  
            command.config.cooldowns || 0,  
            prefix,  
            global.config.BOTNAME || "𝐉𝐮𝐛𝐚𝐲𝐞 𝐗 𝐁𝐨𝐭"  
        );  

        downloadImages(files => {  
            const attachments = files.map(f => fs.createReadStream(f));  
            api.sendMessage({ body: detailText, attachment: attachments }, threadID, () => {  
                files.forEach(f => fs.unlinkSync(f));  
            }, messageID);  
        });  
        return;  
    }  

    const arrayInfo = Array.from(commands.keys())
        .filter(cmdName => cmdName && cmdName.trim() !== "")
        .sort();  

    const page = Math.max(parseInt(args[0]) || 1, 1);  
    const numberOfOnePage = 20;  
    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);  
    const start = numberOfOnePage * (page - 1);  
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);  

    let msg = helpView.map(cmdName => `┃ ✪ ${cmdName}`).join("\n");

    const text = `╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: ${global.config.BOTNAME || "𝐉𝐮𝐛𝐚𝐲𝐞 𝐗 𝐁𝐨𝐭"}
┃ 👑 Owner: 𝐉𝐔𝐁𝐀𝐘𝐄𝐑 𝐁𝐀𝐁𝐘
╰━━━━━━━━━━━━━━━━╯`;

    downloadImages(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: text, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });  
};
