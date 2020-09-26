'use strict';
const Discord = require('discord.js');
const { prefix, BOT_TOKEN } = require("./config.json");
const client = new Discord.Client();
const sqlite = require("sqlite3").verbose();
const {CanvasRenderService} = require('chartjs-node-canvas');
const fs = require('fs');
 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.on(`ready`, () => {

    console.log("Online");
    client.user.setActivity("Tu madre");

    let db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Conectado al data database');
    });

    db.run(`CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL, total INTEGER NOT NULL)`);

});


client.on(`message`, (message) => {

    const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
    let query = `SELECT * FROM data WHERE userid = ?`;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let userid = message.author.id;
    let uname = message.author.tag;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if(!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, db, query, userid, uname);
    } catch (error){
        console.error(error);
        message.reply(`There was an error trying to execute ${command}. . .`)
    }


});

client.login(BOT_TOKEN); 
