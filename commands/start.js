module.exports = {
    name: 'start',
    description: 'Starting logging messages',
    execute(message, db, query){
        listening(message, db, query);
    }
}

function listening(message, db, query){

    const filter =  (m) => m.author.id == message.author.id
    const collector = message.channel.createMessageCollector(filter)
    console.log("Ready to listen . . .");

    collector.on('collect', m => {

        if (m.content=="!end") {
            console.log("Stopped listening . . .");
            return collector.stop()
        } else {
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
        }     
    })
}