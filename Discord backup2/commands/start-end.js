module.exports = {
    name: 'start',
    description: 'Starting logging messages',
    execute(message, db, userquery){

        const filter =  (m) => m.author.id == message.author.id
        const collector = message.channel.createMessageCollector(filter);
        console.log("Ready to listen . . .");
        message.channel.send("Ready to listen . . .");
        let channelquery = `SELECT * FROM channel WHERE channelid = ?`


        collector.on('collect', m => {

            if (m.content == ".end") {
                console.log("Stopped listening . . .");
                message.channel.send("Stopped listening . . .");
                db.close();
                return collector.stop()
            } else {
                if (message.author.bot) return;

                const userid = message.author.id;
                const uname = message.author.tag;
                const channelid = message.channel.id;
                collector.setMaxListeners(0);

                db.get(channelquery, [channelid], (err, row) => {
        
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (row === undefined) {
                        let insertdatachannel = db.prepare(`INSERT INTO channel VALUES(?,?)`);
                        insertdatachannel.run(channelid, 0);
                        insertdatachannel.finalize();
                        console.log('---Added new channel---')
                        message.channel.send('---Added new channel---');
                        console.log(`${channelid} - 0`);
                        message.channel.send(`${channelid} - 0`);
                        return;
                    } else {
                        let channelcount = row.total;
                        channelcount++;
                        db.run(`UPDATE channel SET total = ? WHERE channelid = ?`, [channelcount, channelid]);
                        console.log(`Updated ${channelid}`);
                        message.channel.send(`Updated ${channelid}`);
                        return;
                    }
                });

                db.get(userquery, [userid], (err, row) => {
    
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (row === undefined) {
                        let insertdataUser = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
                        insertdataUser.run(userid, uname, 0);
                        insertdataUser.finalize();
                        console.log('---Added new user---')
                        console.log(`${userid} - ${uname} - 0`);
                        message.channel.send('---Added new user---')
                        message.channel.send(`${userid} - ${uname} - 0`);
                        return;
                    } else {
                        let usercount = row.total;
                        usercount++;
                        db.run(`UPDATE user SET total = ? WHERE userid = ?`, [usercount, userid]);
                        console.log(`Updated ${uname}`);
                        message.channel.send(`Updated ${uname}`);
                        return;
                    }
                }); 
            }     
        })
    }
}




/*          db.get(userquery, [userid], (err, row) => {
    
                if (err) {
                    console.log(err);
                    return;
                }
                if (row === undefined) {
                    let insertdataUser = db.prepare(`INSERT INTO user VALUES(?,?,?)`);
                    insertdataUser.run(userid, uname, 0);
                    insertdataUser.finalize();
                    console.log('---Added new user---')
                    console.log(`${userid} - ${uname} - 0`);
                    return;
                } else {
                    let usercount = row.total;
                    usercount++;
                    db.run(`UPDATE user SET total = ? WHERE userid = ?`, [usercount, userid]);
                    console.log(`Updated ${uname}`);
                    return;
                }
            }); */