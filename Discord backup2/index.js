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
        console.log('Conectado a datos.db');
    });

    db.run(`CREATE TABLE IF NOT EXISTS user(userid INTEGER NOT NULL, username TEXT NOT NULL, total INTEGER NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS channel(channelid INTEGER NOT NULL, total INTEGER NOT NULL)`)
});


client.on(`message`, (message) => {

    const db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
    let userquery = `SELECT * FROM user WHERE userid = ?`;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let userid = message.author.id;
    let uname = message.author.tag;

    if (!message.content.startsWith(prefix) || message.author.bot || !client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, db, userquery, userid, uname);
    } catch (error){
        console.error(error);
        message.reply(`There was an error trying to execute ${command}. . .`)
    }

});

client.login(BOT_TOKEN); 


















/*const http = require('http');
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});

app.use(express.static('public'));

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
 */

















































/*
client.on('ready', () =>{
    console.log('Listo bro');            //Mensaje de inicio en el log
    client.user.setActivity("Tu madre"); //A que esta jugando
    const list = client.guilds.cache.get("733465575275364352");
    list.members.cache.forEach(member => console.log(member.user.username));
});

client.on('message', (message) => {

    function barrita(totalMessages, steps, init){

        while(init != totalMessages){
            message.channel.send('▆');
            init += steps;
        }
    
    }
    
    switch(message.content){
        case 'ping':
            message.channel.send('pong');
            break;
        case 'cono':
            let memberCount = list.memberCount;                          
            message.channel.send(`Hay ${memberCount} personas`);  
            break;
        case 'user':
            let status = message.author.presence.status;
            let bot = message.author.bot;
            let last = message.channel.lastMessage.content;
            message.channel.send(`Is ${status} with last message: ${last}`);
            if(bot = 0){
                message.channel.send('Es un bot');
            } else {message.channel.send('No es un bot')}
            break;
        case 'caca':
            const list = client.guilds.cache.get("733465575275364352");
            list.members.cache.forEach(member => message.channel.send(`${member.user.id} - ${member.user.username} - ${member.user.presence.status}`));
            break;
        case 'pan':
            barrita(2000, 20, 0);
            break;
        case 'ola':
            message.channel.send(message.member.user.lastMessage);
            break;
        default:
            console.log('Error en el switch') 
        }

}); 


function totalUpdate (database, query, userid){
    database.get(query, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
    let count = row.total;
    count++;
    database.run(`UPDATE data SET total = ? WHERE userid = ?`, [count, userid]);
    console.log("Updated");
    sleep(2000);
    totalUpdate(database, query, userid);
    });
}
*/