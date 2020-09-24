'use strict';
const Discord = require('discord.js');
const { prefix, BOT_TOKEN } = require("./config.json");
const client = new Discord.Client();
const sqlite = require("sqlite3").verbose();

const fs = require('fs');
 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on(`ready`, () => {
    console.log("Online");
    let db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
        if (err) {
            console.log(err.message);
        }

        console.log('Conectado al data database');
    });

    db.run(`CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL, total INTEGER NOT NULL)`);
});


client.on(`message`, (message) => {
    let userid = message.author.id;
    let uname = message.author.tag;
    let db = new sqlite.Database('./datos.db', sqlite.OPEN_READWRITE);
    let query = `SELECT * FROM data WHERE userid = ?`;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command == "getdata"){
        if (!message.mentions.users.size) {
            getdata(db, query, userid, uname);
        } else{
            const taggedUser = message.mentions.users.first();
            userid = taggedUser.id;
            uname = taggedUser.username;
            getdata(db, query, userid, uname);
        }
    }


    if(command == "start"){
        listening(message, db, query);
    }

    if(command == "total"){
        let totalx = 0;
        total(totalx);
        console.log(message);
    }

    if(command == "nose"){
        message.channel.send("Hollla\tCaca")
    }

});

function total(){
    var dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
    let totalx = 0;
    dab.all("SELECT total FROM data", function(err, rows) {
        rows.forEach(function (row) {
            totalx = totalx + row.total;
        })
        client.channels.cache.get('757026137007194191').send("Mensajes totales: " + totalx);
    });	

}


function listening(message, db, query){

    const filter =  (m) => m.author.id == message.author.id
    const collector = message.channel.createMessageCollector(filter)
    console.log("Ready to listen . . .");

    collector.on('collect', m => {

        if (m.content=="!end") {
            console.log("Stopped listening . . .");
            return collector.stop()
        }
        if (message.author.bot) return;

        let userid = message.author.id;
        let uname = message.author.tag;
        collector.setMaxListeners(0);

        db.get(query, [userid], (err, row) => {

            if (err) {

                console.log(err);

            }
            if (row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
                insertdata.run(userid, uname, 0);
                insertdata.finalize();
                db.close();
                return;
            } else {
                let count = row.total;
                count++;
                db.run(`UPDATE data SET total = ? WHERE userid = ?`, [count, userid]);
                console.log("Updated");
                return;
            }
                    
        });            
    })
}

function getdata(db, query, userid, uname){
    db.get(query, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
            insertdata.run(userid, uname, 0);
            insertdata.finalize();
            db.close();
            return;
        } else {
            let count = row.total;
            console.log(`${userid} - ${uname} - ${count}`);
        }   
    });
}


function graph(){
    var dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
    dab.all("SELECT total FROM data", function(err, rows) {
        rows.forEach(function (row) {
            while(i != row.total){

            }
        })
        client.channels.cache.get('738976709751210034').send("");
    });	

}

client.login(BOT_TOKEN); 




































































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